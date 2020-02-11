import Lexer from './Lexer'
import { makeToJSON } from '../utils/helpers'

export default Bar

class Bar {
  constructor(bar, style) {
    this.name = 'bar'
    this.style = style
    if (bar.name === 'lexer') {
      this.parse(bar)
    } else {
      this.parse(new Lexer(bar))
    }
  }

  parse(lexer) {

  }

  toString() { return this.value }
  toJSON = makeToJSON('value')
}
