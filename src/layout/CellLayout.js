import AbstractLayout from './AbstractLayout'
import MusicDataLayout from './MusicDataLayout'
import BarLayout from './BarLayout'
import Bar from '../model/Bar'

const CONVERT_LEFT_BAR = { '|:': '|:', ':|:': '|:', '||': '||' }
const CONVERT_RIGHT_BAR = { ':|': ':|', ':|:': ':|', '||': '||', '|]': '|]' }


export default class CellLayout extends AbstractLayout {
  constructor(cell, style) {
    super()
    this.name = 'cell-layout'

    this.cell = cell
    cell.layout = this  // used by tie
    this.style = style
    this.dataLayout = new MusicDataLayout(cell.data, style)

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
                    (shownLeftBarLayout ? shownLeftBarLayout.width : this.leftBarLayout.width / 2) +
                    (shownRightBarLayout ? shownRightBarLayout.width : this.rightBarLayout.width / 2)

    if (!this.width || this.width < this.minWidth) {
      this.width = this.minWidth
    }
  }

  reflow(newWidth) {
    const dw = newWidth - this.width
    // console.log('reflow cell', dw)

    this.width = newWidth
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

    return { 
      ...super.toJSON(), dataLayout, leftBarLayout, rightBarLayout 
    }
  }
}
