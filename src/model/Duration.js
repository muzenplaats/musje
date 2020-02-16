import Lexer from './Lexer'
import { repeat, swapObject, makeToJSON } from '../utils/helpers'

const STR_TO_TYPE = {
  '---': 1, '-': 2, '': 4, '_': 8, '=': 16, '=_': 32, '==': 64,
  '==_': 128, '===': 256, '===_': 512, '====': 1024
}
const TYPE_TO_STR = swapObject(STR_TO_TYPE)

export default class Duration {
  constructor(duration, style) {
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
    lexer.optional('type', lexeme => { this.type = STR_TO_TYPE[lexeme] })
    lexer.optional('dot', lexeme => { this.dot = lexeme.length })
  }

  toString() { return `${TYPE_TO_STR[this.type]}${repeat('.', this.dot)}` }
  toJSON = makeToJSON('type', 'dot')
}
