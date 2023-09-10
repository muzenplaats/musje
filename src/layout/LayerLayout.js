import AbstractLayout from './AbstractLayout'
import MusicDataLayout from './MusicDataLayout'

/* Ref: CellLayout */
export default class LayerLayout extends AbstractLayout {
  constructor(layer, style) {
    super()
    this.name = 'layer-layout'

    this.layer = layer
    layer.layout = this  // used by tie
    this.style = style
    this.dataLayout = new MusicDataLayout(layer.data, style)

    // v  todo
    this.sticks = []  // will be filled by MeasureLayout
    this.dataLayout.sticks = this.sticks

    // this.setMinWidth()

    // Temp
    this.width = 50

    // this.width = this.minWidth and will be reflowed at align: justify
    this.height = this.dataLayout.dy + this.dataLayout.dy2
    this.dy2 = this.dataLayout.dy2
  }

  // setMinWidth() {
  //   this.minWidth = this.dataLayout.minWidth

  //   if (!this.width || this.width < this.minWidth) {
  //     this.width = this.minWidth
  //   }
  // }

  // reflow(width) {
  //   const dw = width - this.width
  //   // console.log('reflow cell', dw)

  //   this.width = width
  //   this.dataLayout.width += dw
  // }

  set position(pos) {
    super.position = pos
    let { x, by } = this

    this.dataLayout.position = { x, by }

    // Temp
    this.dataLayout.width = 30
    this.dataLayout.height = 15
  }

  toJSON() {
    const { dataLayout } = this
    return { 
      ...super.toJSON(), dataLayout
    }
  }
}
