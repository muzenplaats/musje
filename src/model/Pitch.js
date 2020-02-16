import Lexer from './Lexer'
import { makeToJSON, repeat } from '../utils/helpers'

const STEP_TO_SEMITONE = { 1: 0, 2: 2, 3: 4, 4: 5, 5: 7, 6: 9, 7: 11 }

export default class Pitch {
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
    lexer.optional('accidental', lexeme => { this.accidental = lexeme })
    lexer.token('step', lexeme => { this.step = +lexeme })
    lexer.optional('octave', lexeme => {
      this.octave = lexeme[0] === `'` ? lexeme.length :
                    lexeme[0] === ',' ? -lexeme.length : 0
    })
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
