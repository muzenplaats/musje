import AbstractLayout from './AbstractLayout'
import TextLayout from './TextLayout'

export default class TupletLayout extends AbstractLayout {
  constructor(tuplet, style) {
    super()
    this.name = 'tuplet-layout'
    this.tuplet = tuplet
    tuplet.layout = this
    this.style = style
    this.textLayout = new TextLayout(tuplet.actual, style.tupletFont)
    const { lift, strokeWidth } = style.tuplet
    this.lift = lift
    this.strokeWidth = strokeWidth
    this.pitchTupletSep = style.note.pitchTupletSep
  }

  get endPoints() {
    const { x1, y1 } = this
    const { next } = this.tuplet
    let x2, y2

    if (!next) { // unclosed
      x2 = x1 + 30
      y2 = y1 - 20
    } else {
      x2 = next.layout.x1
      y2 = next.layout.y1
    }

    this.textLayout.position = {
      cx: (x1 + x2) / 2 , cy: (y1 + y2) / 2 - this.pitchTupletSep - this.lift
    }

    this.width = x2 - x1
    this.height = Math.abs(y2 - y1)
    return { x1, y1, x2, y2 }
  }

  toJSON() {
    const { textLayout } = this
    return { ...super.toJSON(), textLayout}
  }
}
