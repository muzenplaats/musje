
export default class PitchLayout {
  constructor(pitch, style) {
    this.pitch = pitch
    this.style = style
  }

  get stepSize() { return this.style.stepFont }

  get accidentalCode() { return ACCIDENTAL_CODE[this.accidental] }

  get accidentalSize() {
    if (this.accidental === 'bb') {
      const af = this.style.accidentalFont
      return { ...af, xShift: af.xShift * 0.66 }
    }
    return this.style.accidentalFont
  }

  get octavesSize() {
    const oct = Math.abs(this.octave)
    const { octaveSize, octavesSep } = this.style.pitch
    return {
      width: octaveSize,
      height: oct * octaveSize + (oct - 1) * octavesSep,
      r: octaveSize / 2
    }
  }

  get size() {
    const { accidental, octave } = this
    const { width: stepW, height: stepH } = this.stepSize
    const accW = accidental ? this.accidentalSize.width : 0
    const accH = accidental ? this.accidentalSize.height : 0
    const octH = octave ? this.octavesSize.height : 0
    const { stepAccidentalSep, stepOctaveSep } = this.style.pitch
    const { lift } = this.style.accidentalFont
    const stepAccH = accidental ? Math.max(stepH, accH + lift) : stepH
    const stepOctH = stepH + (octave ? octH + stepOctaveSep : 0)
    return {
      width: stepW + (accidental ? accW + stepAccidentalSep : 0),
      height: octave >= 0 ? Math.max(stepAccH, stepOctH)
                          : stepAccH + stepOctaveSep + octH
    }
  }

  set position(pos) {
    const { accidental, octave } = this
    const { stepOctaveSep, octaveSize, octavesSep } = this.style.pitch
    const { lift } = this.style.accidentalFont
    this._position = new Position(pos, this.size)
    const { x, x2, y2 } = this._position
    const sy2 = y2 - (octave >= 0 ? 0 : this.octavesSize.height + stepOctaveSep)
    this.stepPosition = new Position({ x2, y2: sy2 }, this.stepSize)
    const { cx: scx, y: sy } = this.stepPosition
    if (accidental) {
      const apos = { x, y2: sy2 - lift }
      this.accidentalPosition = new Position(apos, this.accidentalSize)
    }
    if (octave) {
      const opos = octave > 0 ? { cx: scx, y2: sy - stepOctaveSep }
                              : { cx: scx, y: sy2 + stepOctaveSep }
      this.octavesPosition = new Position(opos, this.octavesSize)
      this.octavesPositions = []
      let oy = this.octavesPosition.y
      const os = { width: octaveSize, height: octaveSize, r: octaveSize / 2 }
      for (let i = 0; i < Math.abs(octave); i++) {
        this.octavesPositions.push(new Position({ cx: scx, y: oy }, os))
        oy += octaveSize + octavesSep
      }
    }
  }

  get position() { return this._position }

}
