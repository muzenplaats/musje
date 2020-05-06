import Lexer from './Lexer'
import { makeToJSON } from '../utils/helpers'

export default class Lyric {
  constructor(lyric, prev) {
    this.name = 'lyric'
    this.prev = prev
    if (lyric.name === 'lexer') {
      this.parse(lyric)
    } else if (typeof lyric === 'string') {
      this.parse(new Lexer(lyric))
    } else {
      this.syllabic = lyric.syllabic
      this.text = lyric.text
    }
  }

  parse(lexer) {
    lexer.token('lyric', lexeme => { this.text = lexeme })
    lexer.skipWhite()

    // syllabic := single | begin | middle | end
    const setHyphened = () => {
      switch (this.prev && this.prev.syllabic) {
        case 'begin': // fall through
        case 'middle': this.syllabic = 'middle'; break
        case 'end': // fall through
        case 'single': // fall through
        default: this.syllabic = 'begin'
      }
    }
    const setUnhyphened = () => {
      switch (this.prev && this.prev.syllabic) {
        case 'begin':
        case 'middle': this.syllabic = 'end'; break
        case 'end':
        case 'single':
        default: this.syllabic = 'single'
      }
    }
    if (lexer.is('-') && !lexer.is('--')  && !lexer.is('lyric-control')) {
      setHyphened(); lexer.token('-'); lexer.skipWhite()
    } else {
      setUnhyphened()
    }
  }

  toString() {
    switch (this.syllabic) {
      case 'single': // fall through
      case 'end': return this.text
      case 'begin': // fall through
      case 'middle': return `${this.text} -`
    }
    return this.text
  }

  toJSON = makeToJSON('syllabic', 'text')
}
