<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  Group,
  BoxGeometry,
  MeshPhongMaterial,
  Mesh,
  AmbientLight,
  DirectionalLight,
  PointLight,
  Fog,
} from 'three'
import { ColorAsciiEffect } from '@/utils/ColorAsciiEffect'

const props = defineProps<{
  active: boolean
}>()

const containerRef = ref<HTMLDivElement | null>(null)

let scene: Scene
let camera: PerspectiveCamera
let renderer: WebGLRenderer
let effect: ColorAsciiEffect
let buildingGroup: Group
let animationId: number
let mouseX = 0
let mouseY = 0
let targetRotationX = 0
let targetRotationY = 0
let isActive = true

const fixedCharSet = ' .:-=+*#%@'

const geometries: BoxGeometry[] = []
const materials: MeshPhongMaterial[] = []

const init = () => {
  if (!containerRef.value) return

  const width = window.innerWidth
  const height = window.innerHeight

  scene = new Scene()
  scene.background = new Color(0x04080c)
  scene.fog = new Fog(0x04080c, 150, 400)

  camera = new PerspectiveCamera(70, width / height, 1, 1000)
  camera.position.z = 200

  renderer = new WebGLRenderer({ antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)

  effect = new ColorAsciiEffect(renderer, fixedCharSet, {
    resolution: 0.35,
    backgroundColor: '#04080c',
    fontSize: 12,
  })
  effect.setSize(width, height)
  containerRef.value.appendChild(effect.domElement)

  buildingGroup = new Group()

  const mainBuildingGeometry = new BoxGeometry(40, 80, 40)
  const mainBuildingMaterial = new MeshPhongMaterial({
    color: 0x6fd0ce,
    flatShading: true,
  })
  geometries.push(mainBuildingGeometry)
  materials.push(mainBuildingMaterial)
  const mainBuilding = new Mesh(mainBuildingGeometry, mainBuildingMaterial)
  mainBuilding.position.y = 10
  buildingGroup.add(mainBuilding)

  const leftBuildingGeometry = new BoxGeometry(30, 50, 30)
  const leftBuildingMaterial = new MeshPhongMaterial({
    color: 0x82d4f2,
    flatShading: true,
  })
  geometries.push(leftBuildingGeometry)
  materials.push(leftBuildingMaterial)
  const leftBuilding = new Mesh(leftBuildingGeometry, leftBuildingMaterial)
  leftBuilding.position.set(-50, -5, 20)
  buildingGroup.add(leftBuilding)

  const rightBuildingGeometry = new BoxGeometry(35, 60, 35)
  const rightBuildingMaterial = new MeshPhongMaterial({
    color: 0x5cb8d9,
    flatShading: true,
  })
  geometries.push(rightBuildingGeometry)
  materials.push(rightBuildingMaterial)
  const rightBuilding = new Mesh(rightBuildingGeometry, rightBuildingMaterial)
  rightBuilding.position.set(55, 0, -10)
  buildingGroup.add(rightBuilding)

  const frontBuildingGeometry = new BoxGeometry(60, 25, 30)
  const frontBuildingMaterial = new MeshPhongMaterial({
    color: 0x4db8b6,
    flatShading: true,
  })
  geometries.push(frontBuildingGeometry)
  materials.push(frontBuildingMaterial)
  const frontBuilding = new Mesh(frontBuildingGeometry, frontBuildingMaterial)
  frontBuilding.position.set(0, -27, 50)
  buildingGroup.add(frontBuilding)

  const backBuildingGeometry = new BoxGeometry(25, 40, 25)
  const backBuildingMaterial = new MeshPhongMaterial({
    color: 0x6fd0ce,
    flatShading: true,
  })
  geometries.push(backBuildingGeometry)
  materials.push(backBuildingMaterial)
  const backBuilding = new Mesh(backBuildingGeometry, backBuildingMaterial)
  backBuilding.position.set(-30, -10, -40)
  buildingGroup.add(backBuilding)

  const windowGeometry = new BoxGeometry(3, 3, 1)
  const windowMaterial = new MeshPhongMaterial({
    color: 0xebfbff,
    flatShading: true,
  })
  geometries.push(windowGeometry)
  materials.push(windowMaterial)

  for (let i = 0; i < 25; i++) {
    const window1 = new Mesh(windowGeometry, windowMaterial)
    window1.position.set(-15 + (i % 5) * 8, -20 + Math.floor(i / 5) * 15, 21)
    buildingGroup.add(window1)
  }

  scene.add(buildingGroup)

  const ambientLight = new AmbientLight(0xffffff, 3)
  scene.add(ambientLight)

  const directionalLight = new DirectionalLight(0xffffff, 4)
  directionalLight.position.set(1, 1, 1).normalize()
  scene.add(directionalLight)

  const pointLight = new PointLight(0x82d4f2, 3, 500)
  pointLight.position.set(100, 100, 100)
  scene.add(pointLight)

  const pointLight2 = new PointLight(0x6fd0ce, 3, 500)
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
  effect?.dispose()

  if (containerRef.value && effect?.domElement) {
    containerRef.value.removeChild(effect.domElement)
  }

  renderer?.dispose()
})
</script>

<template>
  <div ref="containerRef" class="ascii-background" v-show="active"></div>
</template>
