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
    this.minWidth = max(this.cellsLayouts.map(layout => layout.minWidth))
    this.makeSticks()
    this.width = this.minWidth
    this.height = 50
  }

  set position(pos) {
    super.position = pos
    let { x, x2, y2 } = this

    this.cellsLayouts.forEach(layout => {
      layout.position = { x, y2 }
      if (this.atSysBegin) {
        layout.addShownLeftBar()
      } else if (this.atSysEnd) {
        layout.addShownRightBar()
      }
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
