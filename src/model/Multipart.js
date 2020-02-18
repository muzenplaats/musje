import Lexer from './Lexer'
import { makeToJSON } from '../utils/helpers'
import Layer from './Layer.js'

export default class Multipart {
  constructor(multipart) {
    this.name = 'multipart'
    if (multipart.name === 'lexer') {
      this.parse(multipart)
    } else if (typeof multipart === 'string') {
      this.parse(new Lexer(multipart))
    } else {
      this.layers = multipart.layers.map(mp => new Layer(mp))
    }
  }

  parse(lexer) {
    this.layers = []
    lexer.token('<')
    while(!lexer.is('>') && !lexer.eof) {
      this.layers.push(new Layer(lexer))
    }
    lexer.token('>')
  }

  toString() {
    return `<${this.layers.join(' | ')}>`
  }

  toJSON = makeToJSON('layers')
}
