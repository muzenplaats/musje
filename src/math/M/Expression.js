import Lexer from './Lexer'
import { makeToJSON } from '../utils/helpers'

export default class Expression {
  consturctor(expr) {
    this.name = 'expression'
    if (expr.name === 'lexer') {
      this.parse(expr)
    } else if (typeof expr === 'string') {
      this.parse(new Lexer(expr)
    } else {

    }
  }

  parse(lexer) {

  }

  toString() {}
  toJSON = makeToJSON()
}

