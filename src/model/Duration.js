import Lexer from './Lexer'
import { makeToJSON } from '../utils/helpers'

export default Duration

class Duration {
  constructo(duration, style) {
    this.name = 'duration'
    if (duration.name === 'lexer') {
      this.parse(duration)
    } else if (typeof duration === 'string') {
      this.parse(new Lexer(duration))
    } else {
      this.type = duration.type
      this.dot = duration.dot
    }
  }

  parse(lexer) {

  }

  toString() {}
  toJSON = makeToJSON('type', 'dot')
}
