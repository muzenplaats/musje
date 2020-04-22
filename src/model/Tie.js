import Lexer from './Lexer'
import { makeToJSON } from '../utils/helpers'

export default class Tie {
  constructor(tie) {
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

  get onplay() { return this._onplay || (() => {}) }
  set onplay(newf) {
    const oldf = this.onplay
    this._onplay = () => { oldf(); newf() }
  }
  get onstop() { return this._onstop || (() => {}) }
  set onstop(newf) {
    const oldf = this.onstop
    this._onstop = () => { oldf(); newf() }
  }

  toString() { return this.type === 'end' ? '' : '~' }
  toJSON = makeToJSON('type')
}
