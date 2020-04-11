import Lexer from './Lexer'
import { makeToJSON } from '../utils/helpers'
import Head from './Head'
import Body from './Body'
import fromMxl from './fromMxl'
import toMxl from './toMxl'

export default class Score {
  constructor(score = {}) {
    this.name = 'score'
    if (typeof score === 'string') {
      this.parse(new Lexer(score))
    } else {
      this.head = new Head(score.head)
      this.body = new Body(score.body)
    }
  }

  parse(lexer) {
    lexer.skipWhite()
    this.head = new Head(lexer)
    this.body = new Body(lexer)
  }

  toString() { return [this.head, this.body].join('\n') }
  toJSON = makeToJSON('head', 'body')

  toMxl = toMxl

  static fromMxl = fromMxl
}
