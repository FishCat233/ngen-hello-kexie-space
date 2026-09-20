<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { Renderer, Program, Mesh, Color, Triangle } from 'ogl'

interface Props {
  className?: string
  colorStops?: [string, string, string]
  speed?: number
  blend?: number
  amplitude?: number
  lightMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
  colorStops: () => ['#171D22', '#7cff67', '#171D22'],
  speed: 1.0,
  blend: 0.5,
  amplitude: 1.0,
  lightMode: false,
})

const containerRef = ref<HTMLDivElement | null>(null)

// GLSL ES 3.0 顶点着色器：全屏三角形，无需 UV
const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

// GLSL ES 3.0 片段着色器：simplex noise + 三色渐变 + 高度场生成极光形态
const FRAG = `#version 300 es
precision highp float;
uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;
uniform float uLightMode;
out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );
  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ),
      0.0
  );
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {              \
  int index = 0;                                            \
  for (int i = 0; i < 2; i++) {                               \
     ColorStop currentColor = colors[i];                    \
     bool isInBetween = currentColor.position <= factor;    \
     index = int(mix(float(index), float(i), float(isInBetween))); \
  }                                                         \
  ColorStop currentColor = colors[index];                   \
  ColorStop nextColor = colors[index + 1];                  \
  float range = nextColor.position - currentColor.position; \
  float lerpFactor = (factor - currentColor.position) / range; \
  finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);

  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);

  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;

  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);

  vec3 auroraColor = intensity * rampColor;

  if (uLightMode > 0.5) {
    float energy = clamp(max(intensity, 0.0), 0.0, 1.0);
    float coverage = clamp(auroraAlpha * (0.55 + 0.45 * energy), 0.0, 0.86);
    vec3 chroma = pow(clamp(rampColor, 0.0, 1.0), vec3(1.2));
    float chromaPeak = max(chroma.r, max(chroma.g, chroma.b));
    chroma /= max(chromaPeak, 0.0001);
    fragColor = vec4(mix(vec3(1.0), chroma, min(coverage * 1.08, 0.94)), 1.0);
  } else {
    fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
  }
}
`

let renderer: Renderer | null = null
let program: Program | null = null
let mesh: Mesh | null = null
let rafId = 0
let resizeObserver: ResizeObserver | null = null
let startTime = 0

onMounted(() => {
  const container = containerRef.value
  if (!container) return

  renderer = new Renderer({
    alpha: true,
    premultipliedAlpha: true,
    antialias: true,
  })
  const gl = renderer.gl
  gl.clearColor(0, 0, 0, 0)
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
  gl.canvas.style.backgroundColor = 'transparent'
  gl.canvas.style.width = '100%'
  gl.canvas.style.height = '100%'
  gl.canvas.style.display = 'block'

  const geometry = new Triangle(gl)
  // Triangle 自带 uv 属性，本 shader 不需要，删除避免警告
  if (geometry.attributes.uv) {
    delete geometry.attributes.uv
  }

  const colorStopsArray = props.colorStops.map((hex) => {
    const c = new Color(hex)
    return [c.r, c.g, c.b]
  })

  program = new Program(gl, {
    vertex: VERT,
    fragment: FRAG,
    uniforms: {
      uTime: { value: 0 },
      uAmplitude: { value: props.amplitude },
      uColorStops: { value: colorStopsArray },
      uResolution: { value: [container.offsetWidth, container.offsetHeight] },
      uBlend: { value: props.blend },
      uLightMode: { value: props.lightMode ? 1 : 0 },
    },
  })

  mesh = new Mesh(gl, { geometry, program })
  container.appendChild(gl.canvas)

  startTime = performance.now()

  const handleResize = () => {
    if (!container || !renderer || !program) return
    const w = container.offsetWidth || 1
    const h = container.offsetHeight || 1
    renderer.setSize(w, h)
    program.uniforms.uResolution.value = [w, h]
  }
  handleResize()

  if ('ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)
  } else {
    window.addEventListener('resize', handleResize)
  }

  const loop = () => {
    if (!renderer || !program || !mesh) return
    const elapsed = (performance.now() - startTime) / 1000
    // 速度系数 0.1 让极光缓慢流动；uTime 实际驱动 simplex noise 时间轴
    program.uniforms.uTime.value = elapsed * props.speed * 0.1
    program.uniforms.uAmplitude.value = props.amplitude
    program.uniforms.uBlend.value = props.blend
    program.uniforms.uLightMode.value = props.lightMode ? 1 : 0
    const stops = props.colorStops.map((hex) => {
      const c = new Color(hex)
      return [c.r, c.g, c.b]
    })
    program.uniforms.uColorStops.value = stops
    renderer.render({ scene: mesh })
    rafId = requestAnimationFrame(loop)
  }
  rafId = requestAnimationFrame(loop)
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
  if (resizeObserver) resizeObserver.disconnect()
  else window.removeEventListener('resize', () => {})
  const container = containerRef.value
  const gl = renderer?.gl
  if (container && gl && gl.canvas.parentNode === container) {
    container.removeChild(gl.canvas)
  }
  gl?.getExtension('WEBGL_lose_context')?.loseContext()
  renderer = null
  program = null
  mesh = null
})
</script>

<template>
  <div ref="containerRef" class="aurora-container" :class="className"></div>
</template>

<style scoped>
.aurora-container {
  width: 100%;
  height: 100%;
}
</style>
