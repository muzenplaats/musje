import AbstractLayout from './AbstractLayout'

export default class TieLayout extends AbstractLayout {
  constructor(tie, style) {
    super()
    this.name = 'tie-layout'
    this.tie = tie
    tie.layout = this
    this.style = style
  }

  setPosition(x1, y1, x2, y2) {
    Object.assign(this, { width: x2 - x1, height: y2 - y1 }, { x1, y1 })
  }

  set position(pos) {
    super.position = pos
  }

  get endPoints() {
    const { x1, y1 } = this
    const { next, sys } = this.tie
    let x2, y2

    // Incorrect tie
    if (!next) {
      x2 = x1 + 30
      y2 = y1 - 20

    // Tie to the same system
    } else if (sys === next.sys) {
      x2 = next.layout.x1
      y2 = next.layout.y1

    // Tie to next system
    } else {
      const clo = this.cell.layout
      const rightBarLayout = clo.shownRightBarLayout || clo.rightBarLayout
      x2 = rightBarLayout.x
      y2 = rightBarLayout.y
    }

    this.width = x2 - x1
    this.height = Math.abs(y2 - y1)
    return { x1, y1, x2, y2 }
  }

  // Tie to previous system
  get prevEndPoints() {
    const { x: x1, y: y1 } = this
    const { x: x2, y: y2 } = this.cell.layout.shownLeftBarLayout
    return { x1, y1, x2, y2 }
  }
}
