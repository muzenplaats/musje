import Lexer from './Lexer'
import { makeToJSON, repeat } from '../utils/helpers'

const STEP_TO_SEMITONE = { 1: 0, 2: 2, 3: 4, 4: 5, 5: 7, 6: 9, 7: 11 }

class Pitch {
  constructor(pitch, style) {
    this.name = 'pitch'
    this.style = style
    if (pitch.name === 'lexer') {
      this.parse(pitch)
    } else if (typeof pitch === 'string') {
      this.parse(new Lexer(pitch))
    } else {
      this.step = pitch.step
      this.accidental = pitch.accidental
      this.octave = pitch.octave
    }
  }

  parse(lexer) {

  }

  get midiNumber() {
    return STEP_TO_SEMITONE[this.step] + this.alter + this.octave * 12 + 60
  }

  get frequency() { return Math.pow(2, (this.midiNumber - 69) / 12) * 440 }

  toString() {
    const { step, accidental, octave } = this
    const oct = octave > 0 ? repeat('\'', octave) : repeat(',', -octave)
    return `${accidental}${step}${oct}`
  }

  toJSON = makeToJSON('step', 'accidental', 'octave')
}

export default Pitch
