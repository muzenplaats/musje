import { makeToJSON } from '../utils/helpers'
import Lexer from './Lexer'

export default class SolfegeKey {
  constructor(key) {
    this.name = 'solfege-key'
    if (key.name === 'lexer') {
      this.parse(key)
    } else if (typeof key === 'string') {
      this.parse(new Lexer(key))
    } else {
    }
  }

  // C Am Dm Bd C# ... 12 + 12-alias
  parse(lexer) {

  }

  toString() { return `` }
  toJSON = makeToJSON()

  static fromKey(key) {

  }
}
