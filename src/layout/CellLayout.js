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

    // Tmp
    // this.width = this.minWidth
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
    const { leftBar, rightBar, shownLeftBar, shownRightBar } = this.cell
    this.minWidth = this.dataLayout.minWidth + paddingLeft + paddingRight +
                    (shownLeftBar ? this.shownLeftBarLayout.width :
                                    this.leftBarLayout.width / 2) +
                    (shownRightBar ? this.shownRightBarLayout. width :
                                     this.rightBarLayout.width / 2)
    this.width = this.minWidth
  }

  set position(pos) {
    super.position = pos
    let { x, x2, by } = this
    const { paddingLeft, paddingRight } = this.style.cell
    const { shownLeftBar, shownRightBar } = this.cell
    if (shownLeftBar) {
      this.shownLeftBarLayout.position = { x, by }
      x += this.shownLeftBarLayout.width + paddingLeft
      this.dataLayout.position = { x, by }
    }

    if (shownRightBar) {
      this.shownRightBarLayout.position = { x2, by }
      x2 = this.shownRightBarLayout.x - paddingRight
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
    console.log('cell set min width', this.sticks)
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
    const { dataSep } = this.style.cell
    let { x, by } = this
    // this.layouts.forEach(layout => {
    //   layout.position = { x, by }
    //   x = layout.x2 + dataSep
    // })

    this.sticks.forEach(stick => {
      const { dirsAbove, main, dirsBelow, lyrics, x: sx } = stick
      if (main) main.position = { bx: x + sx, by }
    })
  }

  toJSON() {
    const { layouts } = this
    return { ...super.toJSON(), layouts }
  }
}
