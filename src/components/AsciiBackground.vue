<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js'

const containerRef = ref<HTMLDivElement | null>(null)

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let effect: AsciiEffect
let buildingGroup: THREE.Group
let animationId: number
let mouseX = 0
let mouseY = 0
let targetRotationX = 0
let targetRotationY = 0

// ASCII 字符集 - 使用固定字符
const fixedCharSet = ' .:-=+*#%@'

const init = () => {
  if (!containerRef.value) return

  const width = window.innerWidth
  const height = window.innerHeight

  // 场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x04080c)

  // 相机
  camera = new THREE.PerspectiveCamera(70, width / height, 1, 1000)
  camera.position.z = 200

  // 渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)

  // ASCII 效果
  effect = new AsciiEffect(renderer, fixedCharSet, {
    invert: true,
    resolution: 0.15,
  })
  effect.setSize(width, height)
  effect.domElement.style.color = '#82d4f2'
  effect.domElement.style.backgroundColor = '#04080c'
  containerRef.value.appendChild(effect.domElement)

  // 创建校园建筑模型
  buildingGroup = new THREE.Group()

  // 主教学楼 - 中央高楼
  const mainBuildingGeometry = new THREE.BoxGeometry(40, 80, 40)
  const mainBuildingMaterial = new THREE.MeshPhongMaterial({
    color: 0x6fd0ce,
    flatShading: true,
  })
  const mainBuilding = new THREE.Mesh(mainBuildingGeometry, mainBuildingMaterial)
  mainBuilding.position.y = 10
  buildingGroup.add(mainBuilding)

  // 左侧配楼
  const leftBuildingGeometry = new THREE.BoxGeometry(30, 50, 30)
  const leftBuildingMaterial = new THREE.MeshPhongMaterial({
    color: 0x82d4f2,
    flatShading: true,
  })
  const leftBuilding = new THREE.Mesh(leftBuildingGeometry, leftBuildingMaterial)
  leftBuilding.position.set(-50, -5, 20)
  buildingGroup.add(leftBuilding)

  // 右侧配楼
  const rightBuildingGeometry = new THREE.BoxGeometry(35, 60, 35)
  const rightBuildingMaterial = new THREE.MeshPhongMaterial({
    color: 0x5cb8d9,
    flatShading: true,
  })
  const rightBuilding = new THREE.Mesh(rightBuildingGeometry, rightBuildingMaterial)
  rightBuilding.position.set(55, 0, -10)
  buildingGroup.add(rightBuilding)

  // 前方低层建筑
  const frontBuildingGeometry = new THREE.BoxGeometry(60, 25, 30)
  const frontBuildingMaterial = new THREE.MeshPhongMaterial({
    color: 0x4db8b6,
    flatShading: true,
  })
  const frontBuilding = new THREE.Mesh(frontBuildingGeometry, frontBuildingMaterial)
  frontBuilding.position.set(0, -27, 50)
  buildingGroup.add(frontBuilding)

  // 后方建筑
  const backBuildingGeometry = new THREE.BoxGeometry(25, 40, 25)
  const backBuildingMaterial = new THREE.MeshPhongMaterial({
    color: 0x6fd0ce,
    flatShading: true,
  })
  const backBuilding = new THREE.Mesh(backBuildingGeometry, backBuildingMaterial)
  backBuilding.position.set(-30, -10, -40)
  buildingGroup.add(backBuilding)

  // 添加一些装饰性的小方块代表窗户细节
  const windowGeometry = new THREE.BoxGeometry(3, 3, 1)
  const windowMaterial = new THREE.MeshPhongMaterial({
    color: 0xebfbff,
    flatShading: true,
  })

  for (let i = 0; i < 20; i++) {
    const window1 = new THREE.Mesh(windowGeometry, windowMaterial)
    window1.position.set(-15 + (i % 5) * 8, -20 + Math.floor(i / 5) * 15, 21)
    buildingGroup.add(window1)
  }

  scene.add(buildingGroup)

  // 灯光
  const ambientLight = new THREE.AmbientLight(0x404040, 2)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
  directionalLight.position.set(1, 1, 1).normalize()
  scene.add(directionalLight)

  const pointLight = new THREE.PointLight(0x82d4f2, 1, 500)
  pointLight.position.set(100, 100, 100)
  scene.add(pointLight)

  const pointLight2 = new THREE.PointLight(0x6fd0ce, 1, 500)
  pointLight2.position.set(-100, -100, 100)
  scene.add(pointLight2)

  // 鼠标移动事件
  document.addEventListener('mousemove', onDocumentMouseMove)

  // 窗口大小调整
  window.addEventListener('resize', onWindowResize)
}

const onDocumentMouseMove = (event: MouseEvent) => {
  mouseX = (event.clientX - window.innerWidth / 2) / 2
  mouseY = (event.clientY - window.innerHeight / 2) / 2
}

const onWindowResize = () => {
  const width = window.innerWidth
  const height = window.innerHeight

  camera.aspect = width / height
  camera.updateProjectionMatrix()

  renderer.setSize(width, height)
  effect.setSize(width, height)
}

const animate = () => {
  animationId = requestAnimationFrame(animate)

  // 鼠标交互旋转
  targetRotationY = mouseX * 0.001
  targetRotationX = mouseY * 0.001

  if (buildingGroup) {
    buildingGroup.rotation.y += 0.05 * (targetRotationY - buildingGroup.rotation.y)
    buildingGroup.rotation.x += 0.05 * (targetRotationX - buildingGroup.rotation.x)

    // 自动缓慢旋转
    buildingGroup.rotation.y += 0.002
  }

  effect.render(scene, camera)
}

onMounted(() => {
  init()
  animate()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  document.removeEventListener('mousemove', onDocumentMouseMove)
  window.removeEventListener('resize', onWindowResize)

  if (containerRef.value && effect?.domElement) {
    containerRef.value.removeChild(effect.domElement)
  }

  renderer?.dispose()
})
</script>

<template>
  <div ref="containerRef" class="ascii-background"></div>
</template>
