import { getSize } from '../utils/html'
import AbstractLayout from './AbstractLayout'

export default class TimeLayout extends AbstractLayout {
  constructor(time, style) {
    super()
    this.time = time
    this.style = style
    this.beatsLayout = new BeatsLayout(time.beats, style)
    this.beatTypeLayout = new BeatTypeLayout(time.beatType, style)
    this.lineLayout = new LineLayout(this.beatsLayout,
                                     this.beatTypeLayout, style)
    this.width = this.lineLayout.width
    this.setHeight()
  }

  setHeight() {
    const { time, timeFont } = this.style
    const lineH = this.lineLayout.height
    this.height = timeFont.height * 2 + lineH + time.lineNumberSep * 2
  }

  set position(pos) {
    Object.assign(this, pos)
    const { cx, y, cy, y2 } = this
    this.beatsLayout.position = { cx, y }
    this.lineLayout.position = { cx, cy }
    this.beatTypeLayout.position = { cx, y2 }
  }

  toJSON() {
    const { beatsLayout, lineLayout, beatTypeLayout } = this
    return { ...super.toJSON(), beatsLayout, lineLayout, beatTypeLayout }
  }
}

class BeatsLayout extends AbstractLayout {
  constructor(beats, style) {
    super()
    Object.assign(this, style.timeFont)
    this.width = getSize(style.timeFont, beats).width
  }
}

class BeatTypeLayout extends AbstractLayout {
  constructor(beatType, style) {
    super()
    Object.assign(this, style.timeFont)
    this.width = getSize(style.timeFont, beatType).width
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
