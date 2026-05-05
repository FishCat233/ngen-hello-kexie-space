import { WebGLRenderer, WebGLRenderTarget, Color, Scene, Camera } from 'three'

export interface ColorAsciiEffectOptions {
  resolution: number
  charset: string
  backgroundColor: string
  fontSize: number
}

export class ColorAsciiEffect {
  private renderer: WebGLRenderer
  private renderTarget: WebGLRenderTarget
  readonly domElement: HTMLPreElement
  private resolution: number
  private charset: string
  private backgroundColor: string
  private fontSize: number
  private width = 0
  private height = 0
  private charWidth = 0
  private charHeight = 0
  private pixels: Uint8Array

  constructor(
    renderer: WebGLRenderer,
    charset = ' .:-=+*#%@',
    options: Partial<ColorAsciiEffectOptions> = {},
  ) {
    this.renderer = renderer
    this.charset = charset
    this.resolution = options.resolution ?? 0.15
    this.backgroundColor = options.backgroundColor ?? '#04080c'
    this.fontSize = options.fontSize ?? 10

    this.domElement = document.createElement('pre')
    this.domElement.style.margin = '0'
    this.domElement.style.padding = '0'
    this.domElement.style.backgroundColor = this.backgroundColor
    this.domElement.style.fontFamily = 'monospace'
    this.domElement.style.fontSize = `${this.fontSize}px`
    this.domElement.style.lineHeight = '1'
    this.domElement.style.letterSpacing = '0'
    this.domElement.style.whiteSpace = 'pre'
    this.domElement.style.overflow = 'hidden'

    this.renderTarget = new WebGLRenderTarget(1, 1)
    this.pixels = new Uint8Array(4)

    this.updateCharSize()
  }

  private updateCharSize() {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    ctx.font = `${this.fontSize}px monospace`
    const metrics = ctx.measureText('M')
    this.charWidth = metrics.width
    this.charHeight = this.fontSize
  }

  setSize(width: number, height: number) {
    this.width = width
    this.height = height

    const cols = Math.floor(width / this.charWidth)
    const rows = Math.floor(height / this.charHeight)

    const renderWidth = Math.max(1, Math.floor(cols * this.resolution * 10))
    const renderHeight = Math.max(1, Math.floor(rows * this.resolution * 10))

    this.renderTarget.setSize(renderWidth, renderHeight)

    this.domElement.style.width = `${width}px`
    this.domElement.style.height = `${height}px`
  }

  render(scene: Scene, camera: Camera) {
    const currentRenderTarget = this.renderer.getRenderTarget()
    const currentClearColor = new Color()
    this.renderer.getClearColor(currentClearColor)
    const currentClearAlpha = this.renderer.getClearAlpha()

    this.renderer.setRenderTarget(this.renderTarget)
    this.renderer.setClearColor(new Color(this.backgroundColor), 1)
    this.renderer.render(scene, camera)

    const renderWidth = this.renderTarget.width
    const renderHeight = this.renderTarget.height

    const totalPixels = renderWidth * renderHeight * 4
    if (this.pixels.length !== totalPixels) {
      this.pixels = new Uint8Array(totalPixels)
    }

    this.renderer.readRenderTargetPixels(
      this.renderTarget,
      0,
      0,
      renderWidth,
      renderHeight,
      this.pixels,
    )

    this.renderer.setRenderTarget(currentRenderTarget)
    this.renderer.setClearColor(currentClearColor, currentClearAlpha)

    const cols = Math.floor(this.width / this.charWidth)
    const rows = Math.floor(this.height / this.charHeight)

    const cellWidth = renderWidth / cols
    const cellHeight = renderHeight / rows

    let output = ''

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const pixelX = Math.floor(col * cellWidth + cellWidth / 2)
        const pixelY = Math.floor(row * cellHeight + cellHeight / 2)

        const clampedX = Math.min(Math.max(0, pixelX), renderWidth - 1)
        const clampedY = Math.min(Math.max(0, pixelY), renderHeight - 1)

        const index = ((renderHeight - 1 - clampedY) * renderWidth + clampedX) * 4

        const r = this.pixels[index] || 0
        const g = this.pixels[index + 1] || 0
        const b = this.pixels[index + 2] || 0

        const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255

        const charIndex = Math.floor(brightness * (this.charset.length - 1))
        const char = this.charset[charIndex] || ' '

        if (brightness > 0.05) {
          const hexR = r.toString(16).padStart(2, '0')
          const hexG = g.toString(16).padStart(2, '0')
          const hexB = b.toString(16).padStart(2, '0')
          output += `<span style="color:#${hexR}${hexG}${hexB}">${char}</span>`
        } else {
          output += char
        }
      }
      output += '\n'
    }

    this.domElement.innerHTML = output
  }

  dispose() {
    this.renderTarget.dispose()
  }
}
