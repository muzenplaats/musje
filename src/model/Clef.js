import Lexer from './Lexer'

export default class Clef {
  constructor(clef) {
    this.name = 'clef'

    if (clef.name === 'lexer') {
      this.parse(clef)
    } else if (typeof clef === 'string') {
      this.parse(new Lexer(clef))
    } else {
      this.sign = clef.sign
      this.line = clef.line
    }
  }

  parse(lexer) {

  }

  toString() { return `clef(${this.sign}${this.line})` }
  toJSON() {
    const { sign, line } = this
    return { sign, line }
  }
}
