import Lexer from './Lexer'
import { makeToJSON } from '../utils/helpers'
export default Pitch

class Pitch {
  constructor(pitch, style) {
    this.name = 'pitch'
    this.style = style
    if (pitch.name = 'lexer') {
      this.parse(pitch)
    } else if (typeof pitch = 'string') {
      this.parse(new Lexer(pitch))
    } else {
      this.step = note.step
      this.octave = note.octave
      this.accidental = note.accidental
    }
  }

  parse(lexer) {

  }

  get midiNumber() {

  }

  get frequency() {}

  toString() {}
  toJSON = makeToJSON('step', 'octave', 'accidental')
}
