import Lexer from './Lexer'
import { makeToJSON } from '../utils/helpers'

export default Time

class Time {
  constructor(time, style) {
    this.name = 'time'
    this.style = style
    if (time.name === 'lexer') {
      this.parse(time)
    } else if (typeof time === 'string') {
      this.parse(new Lexer(time))
    } else {
      this.beats = time.beats
      this.beatType = time.beatType
    }
  }

  parse(lexer) {

  }

  toString() { return `${this.beats}/${this.beatType}` }
  toJSON = makeToJSON('beats', 'beatType')
}
