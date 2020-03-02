import { getSize } from '../utils/html'
import AbstractLayout from './AbstractLayout'

export default class TimeLayout extends AbstractLayout {
  constructor(time, style) {
    super()
    this.name = 'time-layout'
    this.time = time
    this.style = style
    this.beatsLayout = new BeatsLayout(time.beats, style)
    this.beatTypeLayout = new BeatTypeLayout(time.beatType, style)
    this.lineLayout = new LineLayout(this.beatsLayout,
                                     this.beatTypeLayout, style)
  }

  get width() {
    return this.lineLayout.width
  }

  get height() {
    const { time, timeFont } = this.style
    const lineH = this.lineLayout.height
    return timeFont.height * 2 + lineH + time.lineNumberSep * 2
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
    this.beats = beats
    this.style = style
    const { timeFont } = this.style
    Object.assign(this, timeFont)
    this.width = getSize(timeFont, this.beats).width
  }
}

class BeatTypeLayout extends AbstractLayout {
  constructor(beatType, style) {
    super()
    this.beatType = beatType
    this.style = style
    Object.assign(this, style.timeFont)
    this.width = getSize(style.timeFont, this.beatType).width
  }
}

class LineLayout extends AbstractLayout {
  constructor(beatsLayout, beatTypeLayout, style) {
    super()
    this.beatsLayout = beatsLayout
    this.beatTypeLayout = beatTypeLayout
    this.style = style
  }

  get width() {
    return Math.max(this.beatsLayout.width, this.beatTypeLayout.width) +
           this.style.time.lineExt * 2
  }

  get height() {
    return this.style.time.lineHeight
  }
}
