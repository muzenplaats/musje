import Lexer from './Lexer'
import Duration from './Duration'

export default class Rest {
  constructor(rest) {
    this.name = 'rest'

    if (rest.name === 'lexer') {
      this.parse(rest)
    } else if (typeof rest === 'string') {
      this.parse(new Lexer(rest))
    } else {
      this.duration = new Duration(rest.duration)
    }
  }

  parse(lexer) {
    lexer.token('0')
    this.duration = new Duration(lexer)
  }

  toString() { return '0' + this.duration }
  toJSON() {
    const { duration } = this
    return { duration }
  }
}
