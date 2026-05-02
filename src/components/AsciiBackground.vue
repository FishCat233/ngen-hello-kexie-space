<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect.js'

const props = defineProps<{
  active: boolean
}>()

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
let isActive = true

const fixedCharSet = ' .:-=+*#%@'

const geometries: THREE.BoxGeometry[] = []
const materials: THREE.MeshPhongMaterial[] = []

const init = () => {
  if (!containerRef.value) return

  const width = window.innerWidth
  const height = window.innerHeight

  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x04080c)

  camera = new THREE.PerspectiveCamera(70, width / height, 1, 1000)
  camera.position.z = 200

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)

  effect = new AsciiEffect(renderer, fixedCharSet, {
    invert: true,
    resolution: 0.15,
  })
  effect.setSize(width, height)
  effect.domElement.style.color = '#82d4f2'
  effect.domElement.style.backgroundColor = '#04080c'
  containerRef.value.appendChild(effect.domElement)

  buildingGroup = new THREE.Group()

  const mainBuildingGeometry = new THREE.BoxGeometry(40, 80, 40)
  const mainBuildingMaterial = new THREE.MeshPhongMaterial({
    color: 0x6fd0ce,
    flatShading: true,
  })
  geometries.push(mainBuildingGeometry)
  materials.push(mainBuildingMaterial)
  const mainBuilding = new THREE.Mesh(mainBuildingGeometry, mainBuildingMaterial)
  mainBuilding.position.y = 10
  buildingGroup.add(mainBuilding)

  const leftBuildingGeometry = new THREE.BoxGeometry(30, 50, 30)
  const leftBuildingMaterial = new THREE.MeshPhongMaterial({
    color: 0x82d4f2,
    flatShading: true,
  })
  geometries.push(leftBuildingGeometry)
  materials.push(leftBuildingMaterial)
  const leftBuilding = new THREE.Mesh(leftBuildingGeometry, leftBuildingMaterial)
  leftBuilding.position.set(-50, -5, 20)
  buildingGroup.add(leftBuilding)

  const rightBuildingGeometry = new THREE.BoxGeometry(35, 60, 35)
  const rightBuildingMaterial = new THREE.MeshPhongMaterial({
    color: 0x5cb8d9,
    flatShading: true,
  })
  geometries.push(rightBuildingGeometry)
  materials.push(rightBuildingMaterial)
  const rightBuilding = new THREE.Mesh(rightBuildingGeometry, rightBuildingMaterial)
  rightBuilding.position.set(55, 0, -10)
  buildingGroup.add(rightBuilding)

  const frontBuildingGeometry = new THREE.BoxGeometry(60, 25, 30)
  const frontBuildingMaterial = new THREE.MeshPhongMaterial({
    color: 0x4db8b6,
    flatShading: true,
  })
  geometries.push(frontBuildingGeometry)
  materials.push(frontBuildingMaterial)
  const frontBuilding = new THREE.Mesh(frontBuildingGeometry, frontBuildingMaterial)
  frontBuilding.position.set(0, -27, 50)
  buildingGroup.add(frontBuilding)

  const backBuildingGeometry = new THREE.BoxGeometry(25, 40, 25)
  const backBuildingMaterial = new THREE.MeshPhongMaterial({
    color: 0x6fd0ce,
    flatShading: true,
  })
  geometries.push(backBuildingGeometry)
  materials.push(backBuildingMaterial)
  const backBuilding = new THREE.Mesh(backBuildingGeometry, backBuildingMaterial)
  backBuilding.position.set(-30, -10, -40)
  buildingGroup.add(backBuilding)

  const windowGeometry = new THREE.BoxGeometry(3, 3, 1)
  const windowMaterial = new THREE.MeshPhongMaterial({
    color: 0xebfbff,
    flatShading: true,
  })
  geometries.push(windowGeometry)
  materials.push(windowMaterial)

  for (let i = 0; i < 20; i++) {
    const window1 = new THREE.Mesh(windowGeometry, windowMaterial)
    window1.position.set(-15 + (i % 5) * 8, -20 + Math.floor(i / 5) * 15, 21)
    buildingGroup.add(window1)
  }

  scene.add(buildingGroup)

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

  document.addEventListener('mousemove', onDocumentMouseMove)
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
  if (!isActive) return
  animationId = requestAnimationFrame(animate)

  targetRotationY = mouseX * 0.002
  targetRotationX = mouseY * 0.002

  if (buildingGroup) {
    buildingGroup.rotation.y += 0.1 * (targetRotationY - buildingGroup.rotation.y)
    buildingGroup.rotation.x += 0.1 * (targetRotationX - buildingGroup.rotation.x)
    buildingGroup.rotation.y += 0.002
  }

  effect.render(scene, camera)
}

const startAnimation = () => {
  if (isActive) return
  isActive = true
  animate()
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
    animate()
  }
})

onUnmounted(() => {
  stopAnimation()
  document.removeEventListener('mousemove', onDocumentMouseMove)
  window.removeEventListener('resize', onWindowResize)

  geometries.forEach((g) => g.dispose())
  materials.forEach((m) => m.dispose())

  if (containerRef.value && effect?.domElement) {
    containerRef.value.removeChild(effect.domElement)
  }

  renderer?.dispose()
})
</script>

<template>
  <div ref="containerRef" class="ascii-background" v-show="active"></div>
</template>
