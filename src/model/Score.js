import Lexer from './Lexer'
import { makeToJSON } from '../utils/helpers'
import Head from './Head'
import Body from './Body'
import fromMxl from './fromMxl'
import toMxl from './toMxl'
import Player from '../player/Player'
import Style from '../utils/Style'
import defaultStyle from '../layout/default.style'

export default class Score {
  constructor(score = {}) {
    this.name = 'score'
    if (typeof score === 'string') {
      this.parse(new Lexer(score))
    } else {
      this.head = new Head(score.head)
      this.body = new Body(score.body)
    }
    this.style = new Style(defaultStyle)
    this.player = new Player(this)
  }

  parse(lexer) {
    lexer.skipWhite()
    this.head = new Head(lexer)
    this.body = new Body(lexer)
  }

  addStyle() {
    const styles = Array.from(arguments)
    styles.forEach(style => this.style.add(style))
  }

  render() {

  }

  play() { this.player.play() }
  pause() { this.player.pause() }
  stop() { this.player.stop() }

  toString() { return [this.head, this.body].join('\n\n') }
  toJSON = makeToJSON('head', 'body')

  toMxl = toMxl

  static fromMxl = fromMxl
}
