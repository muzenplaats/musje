import Lexer from './Lexer'
import { makeToJSON } from '../utils/helpers'
import Lyric from './Lyric'

export default class Lyrics {
  constructor(lyrics) {
    this.name = 'lyrics'
    if (lyrics.name === 'lexer') {
      this.parse(lyrics)
    } else if (typeof lyrics === 'string') {
      this.parse(new Lexer(lyrics))
    } else {
      this.list = lyrics.list.map(item => new Lyric(item))
    }
    this.list.forEach((lyric, l) => {
      if (lyric.syllabic === 'begin' || lyric.syllabic === 'middle') {
        lyric.next = this.list[l + 1]
      }
    })
  }

  parse(lexer) {
    lexer.token('lyrics')
    lexer.token(':')
    lexer.skipWhite()
    this.list = []
    let lyric, prev
    while (lexer.is('lyric')) {
      lyric = new Lyric(lexer, prev)
      this.list.push(lyric)
      prev = lyric
      lexer.skipWhite()
    }
  }

  toString() {

  }

  toJSON = makeToJSON()
}
