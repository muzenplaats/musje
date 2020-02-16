import Lexer from './Lexer'
import { makeToJSON } from '../utils/helpers'
import Duration from './Duration'

export default class Rest {
  constructor(rest, style) {
    this.name = 'rest'
    this.style = style
    if (rest.name === 'lexer') {
      this.parse(rest)
    } else if (typeof rest === 'string') {
      this.parse(new Lexer(rest))
    } else {
      this.duration = new Duration(rest.duration, style)
    }
  }

  parse(lexer) {
    lexer.token('0')
    this.duration = new Duration(lexer, this.style)
  }

  toString() { return '0' + this.duration }
  toJSON = makeToJSON('duration')
}
