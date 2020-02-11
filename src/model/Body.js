import Lexer from './Lexer'
import { makeToJSON } from '../utils/helpers'

export default Body

class Body {
  constructor(body, style) {
    this.name = 'body'
    this.style = style
    if (body.name === 'lexer') {
      this.parse(body)
    } else if (typeof body === 'string') {
      this.parse(new Lexer (body))
    } else {
      this.parts = body.parts
    }
  }

  parse(lexer) {

  }

  toString() {}
  toJSON = makeToJSON('parts')
}
