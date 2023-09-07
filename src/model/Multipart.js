import Lexer from './Lexer'
import Layer from './Layer.js'

/**
 * Multipart := '<<' WS? Layer ('|' Layer) '>>'
 **/
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
    lexer.token('<<')
    lexer.skipWhite()

    while(!lexer.eof) {
      this.layers.push(new Layer(lexer))
      if (lexer.is('>>')) {
        break
      } else {
        lexer.token('|')
        lexer.skipWhite()
      }
    }

    lexer.token('>>')
  }

  toString() {
    return `<${this.layers.join(' | ')}>`
  }

  toJSON() {
    const { layers } = this
    return { layers }
  }
}
