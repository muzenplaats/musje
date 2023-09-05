import AbstractLayout from './AbstractLayout'
import NoteLayout from './NoteLayout'
import RestLayout from './RestLayout'
import ChordLayout from './ChordLayout'
import MultipartLayout from './MultipartLayout'
import TimeLayout from './TimeLayout'
import DirectionLayout from './DirectionLayout'
import BarLayout from './BarLayout'
import Bar from '../model/Bar'
import { max, lastItem } from '../utils/helpers'

const CONVERT_LEFT_BAR = { '|:': '|:', ':|:': '|:', '||': '||' }
const CONVERT_RIGHT_BAR = { ':|': ':|', ':|:': ':|', '||': '||', '|]': '|]' }


export default class CellLayout extends AbstractLayout {
  constructor(cell, style) {
    super()
    this.name = 'cell-layout'

    this.cell = cell
    cell.layout = this  // used by tie
    this.style = style
    this.dataLayout = new DataLayout(cell.data, style)

    this.leftBarLayout = new BarLayout(cell.leftBar, style)
    this.rightBarLayout = new BarLayout(cell.rightBar, style)

    this.sticks = []  // will be filled by MeasureLayout
    this.dataLayout.sticks = this.sticks

    // this.setMinWidth()

    // this.width = this.minWidth and will be reflowed at align: justify
    this.height = Math.max(this.dataLayout.dy, this.rightBarLayout.height) +
                  this.dataLayout.dy2
    this.dy2 = this.dataLayout.dy2
  }

  addShownLeftBar() {
    const { cell } = this
    let { value } = cell.leftBar
    value = CONVERT_LEFT_BAR[value]
    cell.shownLeftBar = new Bar(value)
    this.shownLeftBarLayout = new BarLayout(cell.shownLeftBar, this.style)
    this.setMinWidth()
  }

  addShownRightBar() {
    const { cell } = this
    let { value } = cell.rightBar
    value = CONVERT_RIGHT_BAR[value]
    cell.shownRightBar = new Bar(value)
    this.shownRightBarLayout = new BarLayout(cell.shownRightBar, this.style)
    this.setMinWidth()
  }

  setMinWidth() {
    const { paddingLeft, paddingRight } = this.style.cell
    const { shownLeftBarLayout, shownRightBarLayout } = this.cell

    this.minWidth = this.dataLayout.minWidth + paddingLeft + paddingRight +
                    (shownLeftBarLayout ? shownLeftBarLayout.width :
                                    this.leftBarLayout.width / 2) +
                    (shownRightBarLayout ? shownRightBarLayout.width :
                                     this.rightBarLayout.width / 2)

    if (!this.width || this.width < this.minWidth) this.width = this.minWidth
  }

  reflow(width) {
    const dw = width - this.width
    // console.log('reflow cell', dw)
    this.width = width
    this.dataLayout.width += dw
  }

  set position(pos) {
    super.position = pos
    let { x, x2, by } = this
    const { paddingLeft, paddingRight } = this.style.cell
    const { shownLeftBarLayout, shownRightBarLayout } = this

    if (shownLeftBarLayout) {
      shownLeftBarLayout.position = { x, by }
      x += shownLeftBarLayout.width + paddingLeft
      this.dataLayout.position = { x, by }
    }

    if (shownRightBarLayout) {
      shownRightBarLayout.position = { x2, by }
      x2 = shownRightBarLayout.x - paddingRight
      this.dataLayout.position = { x2, by }
    } else {
      this.rightBarLayout.position = { cx: x2, by }
      x2 = this.rightBarLayout.x - paddingRight
      this.dataLayout.position = { x2, by }
    }
  }

  toJSON() {
    const { dataLayout, leftBarLayout, rightBarLayout } = this
    return { ...super.toJSON(), dataLayout, leftBarLayout, rightBarLayout }
  }
}

class DataLayout extends AbstractLayout {
  constructor(data, style) {
    super()
    this.name = 'data-layout'
    this.data = data
    this.style = style
    this.setLayouts()
    // this.setMinWidth()

    // Tmp
    this.width = this.minWidth
    this.setHeight()
  }

  setLayouts() {
    const { style } = this

    this.layouts = this.data.map(dt => {
      switch (dt.name) {
        case 'note':  return new NoteLayout(dt, style)
        case 'rest':  return new RestLayout(dt, style)
        case 'chord': return new ChordLayout(dt, style)
        case 'multipart': return new MultipartLayout(dt, style)
        case 'time':  return new TimeLayout(dt, style)
        case 'direction': return new DirectionLayout(dt, style)
      }
    })
  }

  // Set by MeasureLayout
  setMinWidth() {
    const firstStick = this.sticks[0]
    const lastStick = lastItem(this.sticks)
    this.minWidth = firstStick.dx + lastStick.x + lastStick.dx2
    this.width = this.minWidth
  }

  // setMinWidth() {
  //   const { dataSep } = this.style.cell
  //   const { layouts } = this
  //   const { length } = layouts
  //   this.minWidth = length ? (length - 1) * dataSep : 0
  //   layouts.forEach(layout => { this.minWidth += layout.width })
  // }

  setHeight() {
    const dy = max(this.layouts.map(layout => layout.dy).concat(0))
    const dy2 = max(this.layouts.map(layout => layout.dy2).concat(0))
    this.height = dy + dy2
    this.dy = dy
  }

  set position(pos) {
    super.position = pos
    const { dataSep, dataDirectionSep } = this.style.cell
    let { x, by } = this
    // this.layouts.forEach(layout => {
    //   layout.position = { x, by }
    //   x = layout.x2 + dataSep
    // })

    this.sticks.forEach(stick => {
      const { dirsAbove, main, dirsBelow, x: sx } = stick
      const bx = x + sx

      if (main) main.position = { bx, by }

      // Tmp
      if (dirsAbove && dirsAbove.length) {
        const y2 = main.y - dataDirectionSep
        dirsAbove[0].position = { bx, y2 }
      }

      // Tmp
      if (dirsBelow && dirsBelow.length) {
        const y = by + dataDirectionSep
        dirsBelow[0].position = { bx, y }
      }
    })
  }

  toJSON() {
    const { layouts } = this
    return { 
      ...super.toJSON(), layouts 
    }
  }
}
