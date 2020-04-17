import Lexer from './Lexer'
import { makeToJSON } from '../utils/helpers'

export default class Bar {
  constructor(bar = { value: '|' }) {
    this.name = 'bar'
    if (bar.name === 'lexer') {
      this.parse(bar)
    } else if (typeof bar === 'string') {
      this.parse(new Lexer(bar))
    } else {
      this.value = bar.value
    }
  }

  parse(lexer) {
    lexer.token('bar', lexeme => { this.value = lexeme })
  }

  toString() { return this.value }
  toJSON = makeToJSON('value')
}
