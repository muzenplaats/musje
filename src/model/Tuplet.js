import Lexer from './Lexer'
import PlayStopHandleInterface from './PlayStopHandleInterface'

export default class Tuplet extends PlayStopHandleInterface {
  constructor(tuplet) {
    super()
    this.name = 'tuplet'

    if (tuplet.name === 'lexer') {
      this.parse(tuplet)
    } else if (typeof tuplet === 'string') {
      this.parse(new Lexer(tuplet))
    } else {
      this.type = tuplet.type
    }
  }

  parse(lexer) {
    if (lexer.is('[')) {
      lexer.token('[', () => { this.type = 'begin' })
      lexer.token('digits', lexeme => { this.actual = +lexeme })
      this.normal = 2
      lexer.token(':')
    } else if (lexer.is('tuplet-end')) {
      lexer.token('tuplet-end', () => { this.type = 'end' })
    }
  }

  toString() {
    return this.type
  }

  toJSON() {
    const { type } = this
    return { type }
  }
}
