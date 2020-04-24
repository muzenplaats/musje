import Lexer from './Lexer'
import { makeToJSON } from '../utils/helpers'

export default class Tuplet {
  constructor(tuplet) {
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
    if (lexer.is('(')) {
      lexer.token('(', () => { this.type = 'begin' })
      lexer.token('digits', lexeme => { this.actual = +lexeme })
      this.normal = 2
      lexer.token(':')
    } else if (lexer.is('tuplet-end')) {
      lexer.token('tuplet-end', () => { this.type = 'end' })
    }
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

  toString() { return this.type }
  toJSON = makeToJSON('type')
}
