import AbstractLayout from './AbstractLayout'
import Layout from './Layout'
import { range } from '../utils/helpers'

export default class DurationLayout extends AbstractLayout {
  constructor(duration, style) {
    super()
    this.name = 'duration-layout'
    this.duration = duration
    this.style = style
    const { type, dots } = duration
    if (dots) this.dotsLayout = new DotsLayout(duration, style)
    if (type < 4) {
      this.linesLayout = new LinesLayout(duration, style)
    } else if (type > 4) {
      this.beamsLayout = new BeamsLayout(duration, this.dotsLayout, style)
    }
    this.setSize()
  }

  setSize() {
    const { type, dots } = this.duration
    if (type === 4) {
      this.setType4Size(dots)
    } else if (type > 4) {
      this.setTypeGt4Size(dots)
    } else {
      this.setTypeLt4Size(dots)
    }
  }

  setTypeLt4Size(dots) {
    const lw = this.linesLayout.width
    const lh = this.linesLayout.height
    if (dots) {
      const { width, height } = this.linesLayout
      const dw = this.dotsLayout.width
      const dh = this.dotsLayout.height
      this.width = lw + this.style.durationLE2.lineDotSep + dw
      this.height = Math.max(lh, dh)
    } else {
      this.width = lw
      this.height = lh
    }
  }

  setType4Size(dots) {
    this.width = dots ? this.dotsLayout.width : 0
    this.height = dots ? this.dotsLayout.height : 0
  }

  setTypeGt4Size(dots) {
    this.width = this.beamsLayout.width
    this.height = this.beamsLayout.height
    if (dots) {
      const { pitchBeamSep } = this.style.note
      const { dotLift } = this.style.durationGE4
      this.height += pitchBeamSep + dotLift + this.dotsLayout.height
    }
  }

  set position(pos) {
    super.position = pos
    const { type, dots } = this.duration
    const { durationLE2, durationGE4 } = this.style
    const { x, x2, y, cy, y2 } = this
    if (type < 4) {
      this.linesLayout.position = { x, cy }
      if (dots) this.dotsLayout.position = { x2, cy }
    } else {
      if (type > 4) this.beamsLayout.position = { x, y2 }
      if (dots) this.dotsLayout.position = { x2, y }
    }
  }

  toJSON() {
    const { beamsLayout, beamsLayouts, linesLayout, linesLayouts,
            dotsLayout, dotsLayouts } = this
    return { ...super.toJSON(), beamsLayout, beamsLayouts, linesLayout,
            linesLayouts, dotsLayout, dotsLayouts }
  }
}

class LinesLayout extends AbstractLayout {
  constructor(duration, style) {
    super()
    this.name = 'lines-layout'
    this.duration = duration
    this.style = style
    this.setLineSize()
    this.setSize(duration.type)
  }

  setLineSize() {
    const { lineWidth: width, lineHeight: height } = this.style.durationLE2
    this.lineSize = { width, height }
  }

  setSize(type) {
    const { lineWidth, linesSep, lineHeight } = this.style.durationLE2
    this.width = type === 2 ? lineWidth : 3 * lineWidth + 2 * linesSep
    this.height = lineHeight
  }

  set position(pos) {
    super.position = pos
    const { type, dots } = this.duration
    const { lineWidth, linesSep } = this.style.durationLE2
    const { x, cy } = this
    this.layouts = range(type === 2 ? 1 : 3).map(n => new Layout({
      x: x + n * (lineWidth + linesSep), cy
    }, this.lineSize))
  }
}

class BeamsLayout extends AbstractLayout {
  constructor(duration, dotsLayout, style) {
    super()
    this.name = 'beams-layout'
    this.duration = duration
    this.dotsLayout = dotsLayout
    this.style = style
    this.setBeamSize()
    this.setSize()
  }

  setBeamSize() {
    this.beamSize = {
      width: this.style.stepFont.width + (this.duration.dots ?
             this.dotsLayout.width + this.style.note.pitchDotSep : 0),
      height: this.style.durationGE4.beamHeight
    }
  }

  setSize() {
    const { numBeams } = this.duration
    const { beamHeight, beamsSep } = this.style.durationGE4
    this.width = this.beamSize.width
    this.height = numBeams * beamHeight + (numBeams - 1) * beamsSep
  }

  set position(pos) {
    const { beamHeight, beamsSep } = this.style.durationGE4
    super.position = pos
    const { x, y2 } = this
    this.layouts = this.duration.beams.map((beam, n) => {
      const layout = new BeamedLayout({
        beam, x, y2: y2 - n * (beamHeight + beamsSep)
      }, this.beamSize)
      beam.layout = layout
      return layout
    })
  }
}

class BeamedLayout extends Layout {
  constructor(pos, size) {
    super(pos, size)
    this.name = 'beamed-layout'
  }
  get beamedWidth() {
    return this.beam.endBeam.layout.x2 - this.x
  }
}

class DotsLayout extends AbstractLayout {
  constructor(duration, style) {
    super()
    this.name = 'dots-layout'
    this.duration = duration
    this.style = style
    this.setDotSize(duration.type)
    this.setSize(duration.type, duration.dots)
  }

  setDotSize(type) {
    const { durationGE4: d4, durationLE2: d2 } = this.style
    const sz = type >= 4 ? d4.dotSize : d2.dotSize
    this.dotSize = { width: sz, height: sz, r: sz / 2 }
  }

  setSize(type, dots) {
    const { durationGE4: d4, durationLE2: d2 } = this.style
    const calcWidth = dsty => dots * dsty.dotSize + (dots - 1) * dsty.dotsSep
    this.width = type >= 4 ? calcWidth(d4) : calcWidth(d2)
    this.height = this.dotSize.height
  }

  set position(pos) {
    super.position = pos
    const { type, dots } = this.duration
    if (type >= 4) {
      const { dotsSep } = this.style.durationGE4
      const { x2, y } = this
      this.layouts = range(dots).map(n => new Layout({
        x2: x2 - n * (this.dotSize.width + dotsSep), y
      }, this.dotSize))
    } else {
      const { dotsSep } = this.style.durationLE2
      const { x2, cy } = this
      this.layouts = range(dots).map(n => new Layout({
        x2: x2 - n * (this.dotSize.width + dotsSep), cy
      }, this.dotSize))
    }
  }
}
