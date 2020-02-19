import Lexer from './Lexer'
import { makeToJSON } from '../utils/helpers'

export default class PartHead {
  constructor(partHead) {
    this.name = 'part-head'
    if (partHead.name === 'lexer') {
      this.parse(partHead)
    } else if (typeof partHead === 'string') {
      this.parse(new Lexer(partHead))
    } else {

    }
  }

  parse(lexer) {

  }

  toString() {}
  toJSON = makeToJSON()
}
