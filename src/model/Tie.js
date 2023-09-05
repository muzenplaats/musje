import Lexer from './Lexer'
import PlayStopHandleInterface from './PlayStopHandleInterface'

export default class Tie extends PlayStopHandleInterface {
  constructor(tie) {
    super()
    this.name = 'tie'

    if (tie.name === 'lexer') {
      this.parse(tie)
    } else if (typeof tie === 'string') {
      this.parse(new Lexer(tie))
    } else {
      this.type = tie.type
      this.cell = tie.cell
    }
  }

  parse(lexer) {
    lexer.token('~', () => { this.type = 'begin' })
  }

  toString() {
    return this.type === 'end' ? '' : '~'
  }

  toJSON() {
    const { type } = this
    return { type }
  }
}
