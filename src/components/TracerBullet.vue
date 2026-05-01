<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const containerRef = ref<HTMLDivElement | null>(null)

let scene: THREE.Scene
let camera: THREE.OrthographicCamera
let renderer: THREE.WebGLRenderer
let animationId: number

interface Bullet {
  mesh: THREE.Mesh
  speed: number
  life: number
  maxLife: number
}

let bullets: Bullet[] = []
let lastSpawnTime = 0

// 深蓝和深青色调 - 提高亮度
const colors = [
  new THREE.Color('#2e86c1'),
  new THREE.Color('#3498db'),
  new THREE.Color('#5dade2'),
  new THREE.Color('#1abc9c'),
  new THREE.Color('#48c9b0'),
  new THREE.Color('#76d7c4'),
  new THREE.Color('#82d4f2'),
  new THREE.Color('#6fd0ce'),
]

const init = () => {
  if (!containerRef.value) return

  const width = window.innerWidth
  const height = window.innerHeight

  // 场景
  scene = new THREE.Scene()

  // 正交相机
  camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 1, 1000)
  camera.position.z = 100

  // 渲染器 - 使用加法混合来实现发光效果
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  containerRef.value.appendChild(renderer.domElement)

  // 窗口大小调整
  window.addEventListener('resize', onWindowResize)
}

const createBulletTexture = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 512
  const ctx = canvas.getContext('2d')!

  // 创建更亮的发光光效
  const gradient = ctx.createLinearGradient(0, 512, 0, 0)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0)')
  gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.1)')
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.6)')
  gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.95)')
  gradient.addColorStop(1, 'rgba(255, 255, 255, 1)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 128, 512)

  // 添加更亮的发光核心
  const coreGradient = ctx.createLinearGradient(64, 512, 64, 0)
  coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0)')
  coreGradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.3)')
  coreGradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.8)')
  coreGradient.addColorStop(1, 'rgba(255, 255, 255, 1)')

  ctx.fillStyle = coreGradient
  ctx.beginPath()
  ctx.ellipse(64, 256, 16, 180, 0, 0, Math.PI * 2)
  ctx.fill()

  // 添加最亮的头部核心
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
  ctx.beginPath()
  ctx.ellipse(64, 480, 10, 20, 0, 0, Math.PI * 2)
  ctx.fill()

  const texture = new THREE.CanvasTexture(canvas)
  return texture
}

const spawnBullet = () => {
  const width = window.innerWidth
  const height = window.innerHeight

  const color = colors[Math.floor(Math.random() * colors.length)]
  const bulletLength = 80 + Math.random() * 100
  const bulletWidth = 3 + Math.random() * 3

  // 创建粒子纹理
  const texture = createBulletTexture()

  // 创建材质 - 使用加法混合实现发光，提高亮度
  const material = new THREE.SpriteMaterial({
    map: texture,
    color: color,
    transparent: true,
    opacity: 0.8 + Math.random() * 0.2,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })

  // 创建精灵
  const sprite = new THREE.Sprite(material)
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
  animationId = requestAnimationFrame(animate)

  // 随机生成新的曳光弹 (每 150-600ms)
  if (currentTime - lastSpawnTime > 150 + Math.random() * 450) {
    spawnBullet()
    lastSpawnTime = currentTime
  }

  const height = window.innerHeight

  // 更新所有曳光弹
  bullets = bullets.filter((bullet) => {
    // 向上移动
    bullet.mesh.position.y += bullet.speed

    // 接近顶部时淡出
    const topThreshold = height / 2 - 100
    if (bullet.mesh.position.y > topThreshold) {
      bullet.life -= 0.015
      const material = bullet.mesh.material as THREE.SpriteMaterial
      material.opacity = bullet.life * (0.8 + Math.random() * 0.2)
    }

    // 移除超出屏幕或生命周期结束的子弹
    if (bullet.mesh.position.y > height / 2 + 100 || bullet.life <= 0) {
      scene.remove(bullet.mesh)
      bullet.mesh.material.dispose()
      return false
    }

    return true
  })

  renderer.render(scene, camera)
}

onMounted(() => {
  init()
  animate(0)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', onWindowResize)

  // 清理资源
  bullets.forEach((bullet) => {
    scene.remove(bullet.mesh)
    bullet.mesh.material.dispose()
  })
  bullets = []

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
  z-index: 15;
  overflow: hidden;
}

.tracer-bullet-container :deep(canvas) {
  display: block;
}
</style>
