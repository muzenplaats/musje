import Lexer from './Lexer'
import { makeToJSON } from '../utils/helpers'

export default class Time {
  constructor(time) {
    this.name = 'time'
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
    lexer.token('beats', lexeme => { this.beats = +lexeme })
    lexer.token('/')
    lexer.token('beatType', lexeme => { this.beatType = +lexeme })
  }

  toString() { return `${this.beats}/${this.beatType}` }
  toJSON = makeToJSON('beats', 'beatType')
}
