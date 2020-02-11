import Lexer from './Lexer'
import { makeToJSON } from '../utils/helpers'
import Duration from './Duration'

export default Chord

class Chord {
  constructor(chord, style) {
    this.name = 'chord'
    this.style = style
    if (chord.name === 'lexer') {
      this.parse(chord)
    } else if (typeof chord === 'string') {
      this.parse(new Lexer(chord))
    } else {
      this.pitches = chord.pitches
      this.duration = new Duration(chord.duration, style)
    }
  }

  parse(lexer) {

  }

  toString() { return this.pitches.join('') + this.duration }
  toJSON = makeToJSON('pitches', 'duration')
}
