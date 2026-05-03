<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import {
  Scene,
  OrthographicCamera,
  WebGLRenderer,
  CanvasTexture,
  Color,
  SpriteMaterial,
  Sprite,
  AdditiveBlending,
} from 'three'

const props = defineProps<{
  active: boolean
}>()

const containerRef = ref<HTMLDivElement | null>(null)

let scene: Scene
let camera: OrthographicCamera
let renderer: WebGLRenderer
let animationId: number
let isActive = true

interface Bullet {
  mesh: Sprite
  speed: number
  life: number
  maxLife: number
}

let bullets: Bullet[] = []
let lastSpawnTime = 0
let bulletTexture: CanvasTexture | null = null

const colors = [
  new Color('#2e86c1'),
  new Color('#3498db'),
  new Color('#5dade2'),
  new Color('#1abc9c'),
  new Color('#48c9b0'),
  new Color('#76d7c4'),
  new Color('#82d4f2'),
  new Color('#6fd0ce'),
]

const init = () => {
  if (!containerRef.value) return

  const width = window.innerWidth
  const height = window.innerHeight

  scene = new Scene()

  camera = new OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 1, 1000)
  camera.position.z = 100

  renderer = new WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  containerRef.value.appendChild(renderer.domElement)

  bulletTexture = createBulletTexture()

  window.addEventListener('resize', onWindowResize)
}

const createBulletTexture = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 512
  const ctx = canvas.getContext('2d')!

  const gradient = ctx.createLinearGradient(0, 512, 0, 0)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0)')
  gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.1)')
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.6)')
  gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.95)')
  gradient.addColorStop(1, 'rgba(255, 255, 255, 1)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 128, 512)

  const coreGradient = ctx.createLinearGradient(64, 512, 64, 0)
  coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0)')
  coreGradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.3)')
  coreGradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.8)')
  coreGradient.addColorStop(1, 'rgba(255, 255, 255, 1)')

  ctx.fillStyle = coreGradient
  ctx.beginPath()
  ctx.ellipse(64, 256, 16, 180, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
  ctx.beginPath()
  ctx.ellipse(64, 480, 10, 20, 0, 0, Math.PI * 2)
  ctx.fill()

  return new CanvasTexture(canvas)
}

const spawnBullet = () => {
  if (!bulletTexture) return

  const width = window.innerWidth
  const height = window.innerHeight

  const color = colors[Math.floor(Math.random() * colors.length)]
  const bulletLength = 80 + Math.random() * 100
  const bulletWidth = 3 + Math.random() * 3

  const material = new SpriteMaterial({
    map: bulletTexture,
    color: color,
    transparent: true,
    opacity: 0.8 + Math.random() * 0.2,
    blending: AdditiveBlending,
    depthWrite: false,
  })

  const sprite = new Sprite(material)
  sprite.scale.set(bulletWidth, bulletLength, 1)
  sprite.position.set((Math.random() - 0.5) * width, -height / 2 - bulletLength / 2, 0)

  scene.add(sprite)

  const bullet: Bullet = {
    mesh: sprite,
    speed: 3 + Math.random() * 4,
    life: 1.0,
    maxLife: 1.0,
  }

  bullets.push(bullet)
}

const onWindowResize = () => {
  const width = window.innerWidth
  const height = window.innerHeight

  camera.left = -width / 2
  camera.right = width / 2
  camera.top = height / 2
  camera.bottom = -height / 2
  camera.updateProjectionMatrix()

  renderer.setSize(width, height)
}

const animate = (currentTime: number) => {
  if (!isActive) return
  animationId = requestAnimationFrame(animate)

  if (currentTime - lastSpawnTime > 150 + Math.random() * 450) {
    spawnBullet()
    lastSpawnTime = currentTime
  }

  const height = window.innerHeight

  bullets = bullets.filter((bullet) => {
    bullet.mesh.position.y += bullet.speed

    const topThreshold = height / 2 - 100
    if (bullet.mesh.position.y > topThreshold) {
      bullet.life -= 0.015
      const material = bullet.mesh.material as SpriteMaterial
      material.opacity = bullet.life * (0.8 + Math.random() * 0.2)
    }

    if (bullet.mesh.position.y > height / 2 + 100 || bullet.life <= 0) {
      scene.remove(bullet.mesh)
      const material = bullet.mesh.material as SpriteMaterial
      material.dispose()
      return false
    }

    return true
  })

  renderer.render(scene, camera)
}

const startAnimation = () => {
  if (isActive) return
  isActive = true
  lastSpawnTime = performance.now()
  animate(performance.now())
}

const stopAnimation = () => {
  isActive = false
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = 0
  }
}

watch(
  () => props.active,
  (val) => {
    if (val) {
      startAnimation()
    } else {
      stopAnimation()
    }
  },
)

onMounted(() => {
  init()
  isActive = props.active
  if (isActive) {
    animate(0)
  }
})

onUnmounted(() => {
  stopAnimation()
  window.removeEventListener('resize', onWindowResize)

  bullets.forEach((bullet) => {
    scene.remove(bullet.mesh)
    const material = bullet.mesh.material as SpriteMaterial
    material.dispose()
  })
  bullets = []

  if (bulletTexture) {
    bulletTexture.dispose()
    bulletTexture = null
  }

  if (containerRef.value && renderer?.domElement) {
    containerRef.value.removeChild(renderer.domElement)
  }
  renderer?.dispose()
})
</script>

<template>
  <div ref="containerRef" class="tracer-bullet-container"></div>
</template>

<style scoped>
.tracer-bullet-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 5;
  overflow: hidden;
}

.tracer-bullet-container :deep(canvas) {
  display: block;
}
</style>
