import AbstractLayout from './AbstractLayout'

export default class SlurLayout extends AbstractLayout {
  constructor(slur, style) {
    super()
    this.name = 'slur-layout'
    this.slur = slur
    this.style = style
  }

  get position() {
    const { x: x1, y: y1 } = this._position
    const { next, sys } = this
    if (!next) return { x1, y1, x2: x1 + 30, y2: y1 - 20 }
    if (sys === next.sys) {
      const { x1: x2, y1: y2 } = next.position
      return { x1, y1, x2, y2 }
    }
    const { x: x2, y: y2 } = this.cell.rightBar.position
    return { x1, y1, x2, y2 }
  }

  get prevPosition() {
    const { x: x1, y: y1 } = this._position
    if (!this.prev) return { x1, y1, x2: x1 - 30, y2: y1 - 20 }
    const { x: x2, y: y2 } = this.cell.shownLeftBar.position
    return { x1, y1, x2, y2 }
  }
}
