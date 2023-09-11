import AbstractLayout from './AbstractLayout'
import LayerLayout from './LayerLayout'


/* Ref: MeasureLayout */
export default class MultipartLayout extends AbstractLayout {
  constructor(multipart, style) {
    super()
    this.name = 'multipart-layout'

    this.multipart = multipart
    this.style = style
    this.layersLayouts = multipart.layers.map(layer => new LayerLayout(layer, style))

    this.width = 60
    this.height = 30
    this.dx = 0
    this.dy = 0
  }

  set position(pos) {
    super.position = pos
    const { x, y2 } = this

    this.layersLayouts.forEach((layout, c) => {
      layout.position = {
        x,
        y2: y2 - c * 20
      }
      // layout.position = { x, by: y + this.staves.by0s[c] }
    })
  }
}
