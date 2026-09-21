<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'

const MAX_COLORS = 8

interface Props {
  className?: string
  rotation?: number
  autoRotate?: number
  speed?: number
  colors?: string[]
  color?: string
  transparent?: boolean
  scale?: number
  frequency?: number
  warpStrength?: number
  mouseInfluence?: number
  parallax?: number
  noise?: number
  iterations?: number
  intensity?: number
  bandWidth?: number
  bloom?: boolean
  bloomStrength?: number
  bloomRadius?: number
  bloomThreshold?: number
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
  rotation: 90,
  autoRotate: 0,
  speed: 0.2,
  colors: () => [],
  color: '',
  transparent: true,
  scale: 1,
  frequency: 1,
  warpStrength: 1,
  mouseInfluence: 1,
  parallax: 0.5,
  noise: 0.15,
  iterations: 1,
  intensity: 1.5,
  bandWidth: 6,
  bloom: false,
  bloomStrength: 0.6,
  bloomRadius: 0.4,
  bloomThreshold: 0.0,
})

const containerRef = ref<HTMLDivElement | null>(null)

const frag = `
#define MAX_COLORS ${MAX_COLORS}
uniform vec2 uCanvas;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uRot;
uniform int uColorCount;
uniform vec3 uColors[MAX_COLORS];
uniform int uTransparent;
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;
uniform vec2 uPointer; // NDC [-1,1]
uniform float uMouseInfluence;
uniform float uParallax;
uniform float uNoise;
uniform int uIterations;
uniform float uIntensity;
uniform float uBandWidth;
varying vec2 vUv;

void main() {
  float t = uTime * uSpeed;
  vec2 p = vUv * 2.0 - 1.0;
  p += uPointer * uParallax * 0.1;
  vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);
  vec2 q = vec2(rp.x * (uCanvas.x / uCanvas.y), rp.y);
  q /= max(uScale, 0.0001);
  q /= 0.5 + 0.2 * dot(q, q);
  q += 0.2 * cos(t) - 7.56;
  vec2 toward = (uPointer - rp);
  q += toward * uMouseInfluence * 0.2;

  for (int j = 0; j < 5; j++) {
    if (j >= uIterations - 1) break;
    vec2 rr = sin(1.5 * (q.yx * uFrequency) + 2.0 * cos(q * uFrequency));
    q += (rr - q) * 0.15;
  }

  vec3 col = vec3(0.0);
  float a = 1.0;

  if (uColorCount > 0) {
    vec2 s = q;
    vec3 sumCol = vec3(0.0);
    float cover = 0.0;
    for (int i = 0; i < MAX_COLORS; ++i) {
      if (i >= uColorCount) break;
      s -= 0.01;
      vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
      float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(i)) / 4.0);
      float kBelow = clamp(uWarpStrength, 0.0, 1.0);
      float kMix = pow(kBelow, 0.3);
      float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
      vec2 disp = (r - s) * kBelow;
      vec2 warped = s + disp * gain;
      float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(i)) / 4.0);
      float m = mix(m0, m1, kMix);
      float w = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));
      sumCol += uColors[i] * w;
      cover = max(cover, w);
    }
    col = clamp(sumCol, 0.0, 1.0);
    a = uTransparent > 0 ? cover : 1.0;
  } else {
    vec2 s = q;
    for (int k = 0; k < 3; ++k) {
      s -= 0.01;
      vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
      float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(k)) / 4.0);
      float kBelow = clamp(uWarpStrength, 0.0, 1.0);
      float kMix = pow(kBelow, 0.3);
      float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
      vec2 disp = (r - s) * kBelow;
      vec2 warped = s + disp * gain;
      float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(k)) / 4.0);
      float m = mix(m0, m1, kMix);
      col[k] = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));
    }
    a = uTransparent > 0 ? max(max(col.r, col.g), col.b) : 1.0;
  }

  col *= uIntensity;

  if (uNoise > 0.0001) {
    float n = fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453123);
    col += (n - 0.5) * uNoise;
    col = clamp(col, 0.0, 1.0);
  }

  vec3 rgb = (uTransparent > 0) ? col * a : col;
  gl_FragColor = vec4(rgb, a);
}
`

const vert = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`

function hexToVec3(hex: string): THREE.Vector3 {
  const h = hex.replace('#', '').trim()
  let v: [number, number, number]
  if (h.length === 3) {
    v = [parseInt(h[0] + h[0], 16), parseInt(h[1] + h[1], 16), parseInt(h[2] + h[2], 16)]
  } else {
    v = [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
  }
  return new THREE.Vector3(v[0] / 255, v[1] / 255, v[2] / 255)
}

let renderer: THREE.WebGLRenderer | null = null
let material: THREE.ShaderMaterial | null = null
let composer: EffectComposer | null = null
let bloomPass: UnrealBloomPass | null = null
let rafId = 0
let resizeObserver: ResizeObserver | null = null
const pointerTarget = new THREE.Vector2(0, 0)
const pointerCurrent = new THREE.Vector2(0, 0)

onMounted(() => {
  const container = containerRef.value
  if (!container) return

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  const geometry = new THREE.PlaneGeometry(2, 2)

  const uColorsArray = Array.from({ length: MAX_COLORS }, () => new THREE.Vector3(0, 0, 0))

  material = new THREE.ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    uniforms: {
      uCanvas: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uSpeed: { value: props.speed },
      uRot: { value: new THREE.Vector2(1, 0) },
      uColorCount: { value: 0 },
      uColors: { value: uColorsArray },
      uTransparent: { value: props.transparent ? 1 : 0 },
      uScale: { value: props.scale },
      uFrequency: { value: props.frequency },
      uWarpStrength: { value: props.warpStrength },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uMouseInfluence: { value: props.mouseInfluence },
      uParallax: { value: props.parallax },
      uNoise: { value: props.noise },
      uIterations: { value: props.iterations },
      uIntensity: { value: props.intensity },
      uBandWidth: { value: props.bandWidth },
    },
    premultipliedAlpha: true,
    transparent: true,
  })

  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: 'high-performance',
    alpha: true,
  })
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setClearColor(0x000000, props.transparent ? 0 : 1)
  renderer.domElement.style.width = '100%'
  renderer.domElement.style.height = '100%'
  renderer.domElement.style.display = 'block'
  container.appendChild(renderer.domElement)

  // Bloom 后处理：把亮色像素向周围衍射，形成渐进光晕
  if (props.bloom) {
    // 关键：用带 alpha 通道的 RT，让透明区域 alpha=0 在 UnrealBloomPass 的
    // AdditiveBlending 下保持透明（src.a=0 + dst.a=0 = 0），避免被强制变黑
    const rt = new THREE.WebGLRenderTarget(
      container.clientWidth || 1,
      container.clientHeight || 1,
      {
        type: THREE.HalfFloatType,
        format: THREE.RGBAFormat,
        depthBuffer: true,
        stencilBuffer: false,
      },
    )
    composer = new EffectComposer(renderer, rt)
    composer.addPass(new RenderPass(scene, camera))
    bloomPass = new UnrealBloomPass(
      new THREE.Vector2(container.clientWidth || 1, container.clientHeight || 1),
      props.bloomStrength,
      props.bloomRadius,
      props.bloomThreshold,
    )
    composer.addPass(bloomPass)
    composer.addPass(new OutputPass())
  }

  const clock = new THREE.Clock()

  const handleResize = () => {
    const w = container.clientWidth || 1
    const h = container.clientHeight || 1
    renderer?.setSize(w, h, false)
    material?.uniforms.uCanvas.value.set(w, h)
    if (composer) composer.setSize(w, h)
  }
  handleResize()

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)
  } else {
    window.addEventListener('resize', handleResize)
  }

  const loop = () => {
    if (!renderer || !material) return
    const dt = clock.getDelta()
    const elapsed = clock.elapsedTime

    material.uniforms.uTime.value = elapsed
    material.uniforms.uSpeed.value = props.speed
    material.uniforms.uScale.value = props.scale
    material.uniforms.uFrequency.value = props.frequency
    material.uniforms.uWarpStrength.value = props.warpStrength
    material.uniforms.uMouseInfluence.value = props.mouseInfluence
    material.uniforms.uParallax.value = props.parallax
    material.uniforms.uNoise.value = props.noise
    material.uniforms.uIterations.value = props.iterations
    material.uniforms.uIntensity.value = props.intensity
    material.uniforms.uBandWidth.value = props.bandWidth
    material.uniforms.uTransparent.value = props.transparent ? 1 : 0

    const palettes = props.colors.filter(Boolean).slice(0, MAX_COLORS)
    const arr = palettes.length > 0 ? palettes : props.color ? [props.color] : []
    for (let i = 0; i < MAX_COLORS; i++) {
      const vec = material.uniforms.uColors.value[i]
      if (i < arr.length) vec.copy(hexToVec3(arr[i]))
      else vec.set(0, 0, 0)
    }
    material.uniforms.uColorCount.value = arr.length

    const deg = (props.rotation % 360) + props.autoRotate * elapsed
    const rad = (deg * Math.PI) / 180
    const c = Math.cos(rad)
    const s = Math.sin(rad)
    material.uniforms.uRot.value.set(c, s)

    const amt = Math.min(1, dt * 8)
    pointerCurrent.lerp(pointerTarget, amt)
    material.uniforms.uPointer.value.copy(pointerCurrent)

    // Bloom 参数动态响应
    if (bloomPass) {
      bloomPass.strength = props.bloomStrength
      bloomPass.radius = props.bloomRadius
      bloomPass.threshold = props.bloomThreshold
    }

    if (composer) {
      composer.render()
    } else {
      renderer.render(scene, camera)
    }
    rafId = requestAnimationFrame(loop)
  }
  rafId = requestAnimationFrame(loop)

  const handlePointerMove = (e: PointerEvent) => {
    const rect = container.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / (rect.width || 1)) * 2 - 1
    const y = -(((e.clientY - rect.top) / (rect.height || 1)) * 2 - 1)
    pointerTarget.set(x, y)
  }
  container.addEventListener('pointermove', handlePointerMove)

  onUnmounted(() => {
    cancelAnimationFrame(rafId)
    if (resizeObserver) resizeObserver.disconnect()
    else window.removeEventListener('resize', handleResize)
    container.removeEventListener('pointermove', handlePointerMove)
    geometry.dispose()
    material?.dispose()
    bloomPass?.dispose()
    composer?.dispose()
    renderer?.dispose()
    renderer?.forceContextLoss()
    if (renderer?.domElement.parentElement === container) {
      container.removeChild(renderer.domElement)
    }
    renderer = null
    material = null
    composer = null
    bloomPass = null
  })
})
</script>

<template>
  <div ref="containerRef" class="color-bends" :class="className"></div>
</template>

<style scoped>
.color-bends {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
</style>
