import AbstractLayout from './AbstractLayout'
import { lastItem } from '../utils/helpers'

export default class SlurLayout extends AbstractLayout {
  constructor(slur, style) {
    super()
    this.name = 'slur-layout'

    this.slur = slur
    slur.layout = this
    this.style = style
    const { lift, strokeWidth } = style.slur
    this.lift = lift
    this.strokeWidth = strokeWidth
  }

  get showPrev() {
    const { prev } = this.slur
    return !prev || prev.layout.sys !== this.sys
  }

  get endPoints() {
    const { x1, y1 } = this
    const { next } = this.slur
    let x2, y2

    // Incorrect slur
    if (!next) {
      x2 = x1 + 30
      y2 = y1 - 20

    // Slur to the same system
    } else if (this.sys === next.layout.sys) {
      x2 = next.layout.x1
      y2 = next.layout.y1

    // Slur to next system
    } else {
      const measureLayout = lastItem(this.systemLayout.measuresLayouts)
      const clo = measureLayout.cellsLayouts[this.c]
      const rightBarLayout = clo.shownRightBarLayout || clo.rightBarLayout
      x2 = rightBarLayout.x
      y2 = rightBarLayout.y
    }

    this.width = x2 - x1
    this.height = Math.abs(y2 - y1)

    return { x1, y1, x2, y2 }
  }

  // Slur to previous system
  get prevEndPoints() {
    const { x: x1, y: y1 } = this
    if (!this.slur.prev) {
      return { x1, y1, x2: x1 - 30, y2: y1 - 20 }
    }

    const measureLayout = this.systemLayout.measuresLayouts[0]
    const clo = measureLayout.cellsLayouts[this.c]
    const { x: x2, y: y2 } = clo.shownLeftBarLayout

    return { x1, y1, x2, y2 }
  }
}
