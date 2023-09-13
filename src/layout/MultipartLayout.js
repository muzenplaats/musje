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

    this.setHeight()
  }

  // Set width is post reflow so this will be called when setting position.
  setWidth() {
    this.dx = this.layersLayouts[0].sticks[0].dx
    this.width = max(this.layersLayouts.map(layout => {
      layout.dataLayout.setWidth()
      const { width } = layout.dataLayout
      layout.width = width
      return width
    }))
  }

  setHeight() {
    const { layersSep } = this.style.multipart

    this.height = sum(this.layersLayouts.map(layout => layout.height)) +
                  (this.layersLayouts.length - 1) * layersSep

    this.dy2 = this.layersLayouts[0].dy2
  }

  set position(pos) {
    this.setWidth()

    super.position = pos
    let { x, y2 } = this
    const { layersSep } = this.style.multipart

    this.layersLayouts.forEach((layout, l) => {
      layout.position = { x, y2 }

      y2 -= layout.height + layersSep
    })
  }
}
