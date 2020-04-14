import AbstractLayout from './AbstractLayout'
import CellLayout from './CellLayout'
import { max } from '../utils/helpers'

export default class MeasureLayout extends AbstractLayout {
  constructor(measure, style) {
    super()
    this.name = 'measure-layout'
    this.measure = measure
    this.style = style
    this.cellsLayouts = measure.cells.map(cell => new CellLayout(cell, style))
    this.setMinWidth()
    this.minWidth = max(this.cellsLayouts.map(layout => layout.minWidth))
    this.makeSticks()
    this.width = this.minWidth
    this.height = 50
  }

  setMinWidth() {
    const { paddingLeft, paddingRight, dataSep } = this.style.cell
    const minWidths = this.measure.cells.map(cell => {
      let width = 0
      cell.data.forEach(dt => { width += dt.width + dataSep })
      return width - (cell.data.length === 0 ? 0 : dataSep)
    })
    this.minWidth = // this.leftBar.size.width / 2 + paddingLeft +
                    max(minWidths) // +
                    // paddingRight + this.rightBar.size.width / 2
  }


  set position(pos) {
    super.position = pos
    let { x, x2, y2 } = this

    this.cellsLayouts.forEach(layout => {
      layout.position = { x, y2 }
      // if (this.atSysBegin) {
      //   cell.shownLeftBar = new Bar(this.leftBar.value, this.style)
      //   cell.shownLeftBar.position = { x, y2 }
      // }
      // cell.rightBar.position = this.atSysEnd ? { x2, y2 }
      //                                        : { cx: x2, y2 }
    })
  }

  makeSticks() {
    // const makeEmptyStick = () => {
      // return { dirsAbove: [], main: null, dirsBelow: [], lyrics: [] }
    // }
    // const shortSticks = this.cells.map(cell => {
      // const sticks = [makeEmptyStick()]
      // let tQ = 0
      // cell.data.forEach(dt => {
        // if
      // })
    // })
  }

  toJSON() {
    const { cellsLayouts } = this
    return { ...super.toJSON(), cellsLayouts }
  }
}
