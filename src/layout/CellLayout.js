import AbstractLayout from './AbstractLayout'
import NoteLayout from './NoteLayout'
import RestLayout from './RestLayout'
import ChordLayout from './ChordLayout'
import MultipartLayout from './MultipartLayout'
import TimeLayout from './TimeLayout'

export default class CellLayout extends AbstractLayout {
  constructor(cell, style) {
    super()
    this.cell = cell
    this.style = style
    this.dataLayout = new DataLayout(cell.data, style)
    const { paddingLeft, paddingRight } = style.cell
    this.minWidth = this.dataLayout.minWidth + paddingLeft + paddingRight
    this.width = this.minWidth   // tmp
    this.height = this.dataLayout.height
  }

  set position(pos) {
    super.position = pos
    const { x, y2 } = this
    const { paddingLeft } = this.style.cell
    this.dataLayout.position = { x: x + paddingLeft, y2 }
  }

  toJSON() {
    const { dataLayout } = this
    return { ...super.toJSON(), dataLayout }
  }
}

class DataLayout extends AbstractLayout {
  constructor(data, style) {
    super()
    this.data = data
    this.style = style
    this.setLayouts()
    this.setMinWidth()
    this.width = this.minWidth   // tmp
    this.setHeight()
  }

  setLayouts() {
    const { data, style } = this
    this.layouts = []
    data.forEach(dt => {
      switch (dt.name) {
        case 'note':
          this.layouts.push(new NoteLayout(dt, style)); break
        case 'rest':
          this.layouts.push(new RestLayout(dt, style)); break
        case 'chord':
          this.layouts.push(new ChordLayout(dt, style)); break
        case 'multipart':
          this.layouts.push(new MultipartLayout(dt, style)); break
        case 'time':
          this.layouts.push(new TimeLayout(dt, style)); break
        case 'direction':
          this.layouts.push(new DirectionLayout(dt, style)); break
      }
    })
  }

  setMinWidth() {
    const { dataSep } = this.style.cell
    const { layouts } = this
    const { length } = layouts
    this.minWidth = length ? (length - 1) * dataSep : 0
    layouts.forEach(layout => { this.minWidth += layout.width })
  }

  setHeight() {
    this.height = 0
    this.layouts.forEach(layout => {
      this.height = Math.max(this.height, layout.height)
    })
  }

  set position(pos) {
    super.position = pos
    const { dataSep } = this.style.cell
    let { x, y2 } = this
    this.layouts.forEach(layout => {
      layout.position = { x, y2 }
      x = layout.x2 + dataSep
    })
  }

  toJSON() {
    const { layouts } = this
    return { ...super.toJSON(), layouts }
  }
}
