import Lexer from './Lexer'
import { makeToJSON } from '../utils/helpers'
import Part from './Part'

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
      this.parts = body.parts.map(part => new Part(part))
    }
  }

  parse(lexer) {
    this.parts = []
    let part
    do {
      part = new Part(lexer)
      if (!part.isEmpty) this.parts.push(part)
    } while (lexer.is('part-head'))
  }

  toString() {}
  toJSON = makeToJSON('parts')
}
