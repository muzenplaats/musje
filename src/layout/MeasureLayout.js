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
    // this.makeSticks()
    this.width = this.minWidth
  }

  // SetHeight by SystemLayout
  setHeight(height, stavesHeights) {
    this.height = height
    this.stavesHeights = stavesHeights
  }

  set position(pos) {
    super.position = pos
    let { x, y } = this

    this.cellsLayouts.forEach((layout, c) => {
      if (this.atSysBegin) {
        layout.addShownLeftBar()
      } else if (this.atSysEnd) {
        layout.addShownRightBar()
      }
      layout.position = { x, y }
      y += this.stavesHeights[c] + this.style.system.stavesSep
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
