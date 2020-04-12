import Lexer from './Lexer'
import { makeToJSON } from '../utils/helpers'

export default class Lyric {
  constructor(lyric) {
    this.name = 'lyric'
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
