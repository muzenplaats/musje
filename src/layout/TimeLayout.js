import { getSize } from '../utils/helpers'
import AbstractLayout from './AbstractLayout'
import TextLayout from './TextLayout'

export default class TimeLayout extends AbstractLayout {
  constructor(time, style) {
    super()
    this.name = 'time-layout'

    this.time = time
    this.style = style
    this.beatsLayout = new TextLayout(time.beats, style.timeFont)
    this.beatTypeLayout = new TextLayout(time.beatType, style.timeFont)
    this.lineLayout = new LineLayout(this.beatsLayout,
                                     this.beatTypeLayout, style)
    this.width = this.lineLayout.width
    this.dx = this.width / 2

    this.setHeight()
  }

  setHeight() {
    const { time, timeFont } = this.style
    const lineH = this.lineLayout.height

    this.height = timeFont.height * 2 + lineH + time.lineNumberSep * 2
    this.dy = this.height
  }

  set position(pos) {
    super.position = pos
    const { cx, y, cy, y2 } = this

    this.beatsLayout.position = { cx, y }
    this.lineLayout.position = { cx, cy }
    this.beatTypeLayout.position = { cx, y2 }
  }

  toJSON() {
    const { beatsLayout, lineLayout, beatTypeLayout } = this
    return {
      ...super.toJSON(), beatsLayout, lineLayout, beatTypeLayout 
    }
  }
}

class LineLayout extends AbstractLayout {
  constructor(beatsLayout, beatTypeLayout, style) {
    super()

    this.width = Math.max(beatsLayout.width, beatTypeLayout.width) +
                 style.time.lineExt * 2
    this.height = style.time.lineHeight
  }
}
