import AbstractLayout from './AbstractLayout'
import LayerLayout from './LayerLayout'
import { sum, max } from '../utils/helpers'

/* Ref: MeasureLayout */
export default class MultipartLayout extends AbstractLayout {
  constructor(multipart, style) {
    super()
    this.name = 'multipart-layout'

    this.multipart = multipart
    this.style = style
    this.layersLayouts = multipart.layers.map(layer => new LayerLayout(layer, style))

    this.dx = this.layersLayouts[0].dx
    this.dy2 = this.layersLayouts[0].dy2
    // this.dx = 0
    this.dy = 0

    this.setHeight()
  }

  get width() {
    return max(this.layersLayouts.map(layout => layout.width))
  }

  setHeight() {
    const { layersSep } = this.style.multipart

    this.height = sum(this.layersLayouts.map(layout => layout.height)) +
                  (this.layersLayouts.length - 1) * layersSep
  }

  set position(pos) {
    super.position = pos
    let { x, y2 } = this
    const { layersSep } = this.style.multipart

    this.layersLayouts.forEach((layout, l) => {
      layout.position = { x, y2 }

      y2 += layout.height + layersSep
    })
  }
}
