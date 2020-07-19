import { makeToJSON } from '../utils/helpers'
import Lexer from './Lexer'
import SolfegeKey from './SolfegeKey'

/* Key Signature for the compatibily in the western sheet music */
export default class Key {
  constructor(key) {
    this.name = 'key'
    if (key.name === 'lexer') {
      this.parse(key)
    } else if (typeof key === 'string') {
      this.parse(new Lexer(key))
    } else {
      this.fifths = key.fifths
      this.mode = key.mode
    }
  }

  get solfedge() { return SolfegeKey.fromKey(this) }

  parse(lexer) {

  }

  toString() { return `key(${this.fifths}${this.mode})` }
  toJSON = makeToJSON('fifths', 'mode')
}
