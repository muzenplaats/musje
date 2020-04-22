import Lexer from './Lexer'
import { makeToJSON } from '../utils/helpers'

export default class Slur {
  constructor(slur) {
    this.name = 'slur'
    if (slur.name === 'lexer') {
      this.parse(slur)
    } else if (typeof slur === 'string') {
      this.parse(new Lexer(slur))
    } else {
      this.value = slur.value
    }
  }

  parse(lexer) {
    lexer.token('paran', lexeme => { this.value = lexeme })
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

  toString() { return this.value }
  toJSON = makeToJSON('value')
}
