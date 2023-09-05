import AbstractLayout from './AbstractLayout'
import Layout from './Layout'
import TieLayout from './TieLayout'
import { range, getSize } from '../utils/helpers'

const ACCIDENTAL_FONT_MAP = {
  '#': '\ue10f', '##': '\ue126', n: '\ue117', b: '\ue11b', bb: '\ue124'
}

export default class PitchLayout extends AbstractLayout {
  constructor(pitch, style) {
    super()
    this.name = 'pitch-layout'
    this.pitch = pitch
    this.style = style
    const { step, accidental, octave, tie } = pitch

    this.stepLayout = new StepLayout(step, style)
    this.accidentalLayout = new AccidentalLayout(accidental, style)
    this.octavesLayout = new OctavesLayout(octave, style)
    if (tie) this.tieLayout = new TieLayout(tie, style)
    this.tieMode = style.chord.tieMode

    this.setSize()
  }

  setSize() {
    const { accidental, octave } = this.pitch
    const { width: stepW, height: stepH } = this.stepLayout
    const accW = accidental ? this.accidentalLayout.width : 0
    const accH = accidental ? this.accidentalLayout.height : 0
    const octH = octave ? this.octavesLayout.height : 0
    const { stepAccidentalSep, stepOctaveSep } = this.style.pitch
    const { lift } = this.style.accidentalFont
    const stepAccH = stepH // accidental ? Math.max(stepH, accH + lift) : stepH
    const stepOctH = stepH + (octave ? octH + stepOctaveSep : 0)

    this.width = stepW + (accidental ? accW + stepAccidentalSep : 0),
    this.height = octave >= 0 ? Math.max(stepAccH, stepOctH)
                              : stepAccH + stepOctaveSep + octH
    this.dx2 = this.stepLayout.width / 2
    this.dy = this.height
  }

  set position(pos) {
    const { accidental, octave, tie } = this.pitch
    const { stepOctaveSep } = this.style.pitch
    const { lift } = this.style.accidentalFont

    super.position = pos
    const { x, x2, y2 } = this
    const sy2 = y2 - (octave >= 0 ? 0 :
                      this.octavesLayout.height + stepOctaveSep)
    this.stepLayout.position = { x2, y2: sy2 }

    const { cx: scx, y: sy } = this.stepLayout

    if (accidental) {
      this.accidentalLayout.position = { x, y2: sy2 - lift }
    }

    if (octave) {
      const opos = octave > 0 ? { cx: scx, y2: sy - stepOctaveSep }
                              : { cx: scx, y: sy2 + stepOctaveSep }
      this.octavesLayout.position = opos
    }

    if (tie) {
      const { cx: x, y } = this.stepLayout
      this.tieLayout.position = { x, y }
    }
  }

  toJSON() {
    const { stepLayout, accidentalLayout, octavesLayout, tieLayout } = this
    return { ...super.toJSON(),
             stepLayout, accidentalLayout, octavesLayout, tieLayout }
  }
}

class StepLayout extends AbstractLayout {
  constructor(step, style) {
    super()
    this.name = 'step-layout'
    Object.assign(this, style.stepFont)
  }
}

class AccidentalLayout extends AbstractLayout {
  constructor(accidental, style) {
    super()
    this.name = 'accidental-layout'
    Object.assign(this, style.accidentalFont)
    this.char = ACCIDENTAL_FONT_MAP[accidental]
    if (this.accidental === 'bb') this.dx = style.accidentalFont.dx * 0.66
  }
}

class OctavesLayout extends AbstractLayout {
  constructor(octave, style) {
    super()
    this.name = 'octaves-layout'
    const oct = Math.abs(octave)
    const { octaveSize, octavesSep } = style.pitch

    this.octave = octave
    this.style = style
    this.width = octaveSize
    this.height = oct * octaveSize + (oct - 1) * octavesSep
    this.r = octaveSize / 2
  }

  set position(pos) {
    super.position = pos
    const { octaveSize, octavesSep } = this.style.pitch
    this.layouts = []
    let { cx, y, width, r } = this

    range(Math.abs(this.octave)).forEach(() => {
      this.layouts.push(new Layout({ cx, y }, { width, height: width, r }))
      y += octaveSize + octavesSep
    })
  }

  toJSON() {
    return { 
      ...super.toJSON(), layouts: this.layouts 
    }
  }
}
