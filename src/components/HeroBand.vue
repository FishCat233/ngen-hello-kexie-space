<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'

interface Props {
  color?: string
  rotation?: number
  speed?: number
  scale?: number
  frequency?: number
  warpStrength?: number
  noise?: number
  bandWidth?: number
  yOffset?: number
  fadeTop?: number
  mouseInfluence?: number
  iterations?: number
  intensity?: number
}

const props = withDefaults(defineProps<Props>(), {
  color: '#3b82f6',
  rotation: 0,
  speed: 0.2,
  scale: 1,
  frequency: 1,
  warpStrength: 11,
  noise: 0.05,
  bandWidth: 1.4,
  yOffset: 0,
  fadeTop: 0.3,
  mouseInfluence: 0.3,
  iterations: 1,
  intensity: 1.0,
})

const containerRef = ref<HTMLDivElement | null>(null)

// 单个超大三角形覆盖整个裁剪空间（全屏三角形技巧），aPos 为裁剪空间坐标
const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`

// 移植自 vue-bits.dev 官网首屏 HeroBand：单色流场弯曲色带，
// fadeTop 控制自底部向上渐隐，鼠标位置参与场扭曲
const FRAG = `
precision highp float;
uniform vec2 uCanvas;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uRot;
uniform vec3 uColor;
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;
uniform float uNoise;
uniform float uBandWidth;
uniform float uYOffset;
uniform float uFadeTop;
uniform vec2 uPointer;
uniform float uMouseInfluence;
uniform int uIterations;
uniform float uIntensity;
varying vec2 vUv;

void main() {
  float t = uTime * uSpeed;
  vec2 uv = vUv;
  uv.y += uYOffset;
  vec2 p = uv * 2.0 - 1.0;
  vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);
  float aspect = uCanvas.x / uCanvas.y;
  vec2 q = vec2(rp.x * aspect, rp.y);
  float invScale = 1.0 / max(uScale, 0.0001);
  q *= invScale;
  q /= 0.5 + 0.2 * dot(q, q);
  q += (uPointer - rp) * uMouseInfluence * 0.2;
  q += 0.2 * cos(t) - 7.56;

  for (int i = 0; i < 5; i++) {
    if (i >= uIterations) break;
    vec2 r = sin(1.5 * (q.yx * uFrequency) + 2.0 * cos(q * uFrequency));
    q = q + (r - q) * uWarpStrength;
  }

  float m = length(q + sin(5.0 * q.y * uFrequency - 3.0 * t) * 0.25);

  float w = 1.0 - exp(-6.0 / exp(6.0 * m));
  w = pow(clamp(w, 0.0, 1.0), uBandWidth);
  w *= smoothstep(uFadeTop, 0.0, vUv.y);
  w *= uIntensity;

  vec3 col = uColor * w;
  col += (fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * uNoise;
  col = clamp(col, 0.0, 1.0) * w;

  gl_FragColor = vec4(col, w);
}
`

const QUAD = new Float32Array([-1, -1, 3, -1, -1, 3])

let gl: WebGLRenderingContext | null = null
let program: WebGLProgram | null = null
let buffer: WebGLBuffer | null = null
let resizeObserver: ResizeObserver | null = null
let intersectionObserver: IntersectionObserver | null = null
let raf: number | null = null
let isVisible = true
let u: Record<string, WebGLUniformLocation | null> = {}
const pointerTarget = [0, 0]
const pointerCurrent = [0, 0]
let rect = { left: 0, top: 0, width: 1, height: 1 }

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '').trim()
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ]
}

function compile(type: number, source: string): WebGLShader | null {
  if (!gl) return null
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function updateUniforms() {
  if (!gl || !program) return
  gl.uniform1f(u.uSpeed, props.speed)
  gl.uniform1f(u.uScale, props.scale)
  gl.uniform1f(u.uFrequency, props.frequency)
  gl.uniform1f(u.uWarpStrength, props.warpStrength)
  gl.uniform1f(u.uNoise, props.noise)
  gl.uniform1f(u.uBandWidth, props.bandWidth)
  gl.uniform1f(u.uYOffset, props.yOffset)
  gl.uniform1f(u.uFadeTop, props.fadeTop)
  gl.uniform1f(u.uMouseInfluence, props.mouseInfluence)
  gl.uniform1i(u.uIterations, props.iterations)
  gl.uniform1f(u.uIntensity, props.intensity)
  const [r, g, b] = hexToRgb(props.color)
  gl.uniform3f(u.uColor, r, g, b)
  const rad = (props.rotation * Math.PI) / 180
  gl.uniform2f(u.uRot, Math.cos(rad), Math.sin(rad))
}

onMounted(() => {
  const currentContainer = containerRef.value
  if (!currentContainer) return

  const canvas = document.createElement('canvas')
  gl = canvas.getContext('webgl', {
    antialias: false,
    alpha: true,
    premultipliedAlpha: true,
    powerPreference: 'high-performance',
  }) as WebGLRenderingContext | null
  if (!gl) return

  const vert = compile(gl.VERTEX_SHADER, VERT)
  const frag = compile(gl.FRAGMENT_SHADER, FRAG)
  if (!vert || !frag) return
  program = gl.createProgram()
  if (!program) return
  gl.attachShader(program, vert)
  gl.attachShader(program, frag)
  gl.linkProgram(program)
  gl.deleteShader(vert)
  gl.deleteShader(frag)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program)
    program = null
    return
  }
  gl.useProgram(program)

  const uniformNames = [
    'uCanvas',
    'uTime',
    'uSpeed',
    'uRot',
    'uColor',
    'uScale',
    'uFrequency',
    'uWarpStrength',
    'uNoise',
    'uBandWidth',
    'uYOffset',
    'uFadeTop',
    'uPointer',
    'uMouseInfluence',
    'uIterations',
    'uIntensity',
  ]
  u = {}
  for (const name of uniformNames) u[name] = gl.getUniformLocation(program, name)

  buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, QUAD, gl.STATIC_DRAW)
  const aPos = gl.getAttribLocation(program, 'aPos')
  gl.enableVertexAttribArray(aPos)
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

  // 输出为预乘 alpha，配合 ONE / ONE_MINUS_SRC_ALPHA 正确混入页面底色
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
  gl.clearColor(0, 0, 0, 0)

  canvas.style.width = '100%'
  canvas.style.height = '100%'
  canvas.style.display = 'block'
  currentContainer.appendChild(canvas)

  // 像素比压到 1：背景光带是低频流体，无高频细节，全分辨率渲染纯属浪费 GPU
  const handleResize = () => {
    if (!gl) return
    const w = currentContainer.clientWidth || 1
    const h = currentContainer.clientHeight || 1
    canvas.width = w
    canvas.height = h
    gl.viewport(0, 0, w, h)
    gl.uniform2f(u.uCanvas, w, h)
    rect = currentContainer.getBoundingClientRect()
  }
  handleResize()

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(currentContainer)
  } else {
    window.addEventListener('resize', handleResize)
  }

  // 滚出视口时停止渲染（首屏下方 150% 高的画布常驻 DOM，离开首屏后无需再画）
  if (typeof IntersectionObserver !== 'undefined') {
    intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
    })
    intersectionObserver.observe(currentContainer)
  }

  const handleVisibility = () => {
    isVisible = !document.hidden
  }
  document.addEventListener('visibilitychange', handleVisibility)

  const handlePointer = (e: MouseEvent) => {
    pointerTarget[0] = ((e.clientX - rect.left) / rect.width) * 2 - 1
    pointerTarget[1] = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
  }
  window.addEventListener('mousemove', handlePointer, { passive: true })

  // 跟随显示器刷新率渲染。省电靠像素比 1 + 滚出视口/切后台暂停，
  // 不做帧率限流——缓慢流动的光带被降到 30fps 会出现肉眼可见的顿挫
  let lastFrame = performance.now()
  const start = lastFrame

  const loop = () => {
    raf = requestAnimationFrame(loop)
    if (!gl || isVisible === false) return
    const now = performance.now()

    // uTime 用挂载以来的墙钟时间，暂停渲染期间动画仍按真实时间推进（与旧 three 版一致）
    gl.uniform1f(u.uTime, (now - start) / 1000)
    const dt = Math.min((now - lastFrame) / 1000, 0.1)
    lastFrame = now
    const amt = Math.min(1, dt * 4)
    pointerCurrent[0] += (pointerTarget[0] - pointerCurrent[0]) * amt
    pointerCurrent[1] += (pointerTarget[1] - pointerCurrent[1]) * amt
    gl.uniform2f(u.uPointer, pointerCurrent[0], pointerCurrent[1])

    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }
  raf = requestAnimationFrame(loop)

  updateUniforms()

  onUnmounted(() => {
    if (raf !== null) cancelAnimationFrame(raf)
    if (resizeObserver) resizeObserver.disconnect()
    else window.removeEventListener('resize', handleResize)
    if (intersectionObserver) intersectionObserver.disconnect()
    document.removeEventListener('visibilitychange', handleVisibility)
    window.removeEventListener('mousemove', handlePointer)
    if (gl) {
      if (buffer) gl.deleteBuffer(buffer)
      if (program) gl.deleteProgram(program)
      const lose = gl.getExtension('WEBGL_lose_context')
      lose?.loseContext()
    }
    if (canvas.parentElement === currentContainer) {
      currentContainer.removeChild(canvas)
    }
    gl = null
    program = null
    buffer = null
  })
})

watch(
  () => [
    props.color,
    props.rotation,
    props.speed,
    props.scale,
    props.frequency,
    props.warpStrength,
    props.noise,
    props.bandWidth,
    props.yOffset,
    props.fadeTop,
    props.mouseInfluence,
    props.iterations,
    props.intensity,
  ],
  () => {
    updateUniforms()
  },
  { deep: true },
)
</script>

<template>
  <div ref="containerRef"></div>
</template>
