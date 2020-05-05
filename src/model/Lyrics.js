import Lexer from './Lexer'
import { makeToJSON } from '../utils/helpers'
import Lyric from './Lyric'
import LyricControl from './LyricControl'

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
    lexer.token('lyrics-head')
    lexer.skipWhite()
    this.list = []
    let lyric, prev
    while (lexer.is('lyric') || lexer.is('lyric-control')) {
      if (lexer.is('lyric')) {
        lyric = new Lyric(lexer, prev)
        this.list.push(lyric)
        prev = lyric
      } else {
        this.list.push(new LyricControl(lexer))
      }
      lexer.skipWhite()
      if (lexer.is('lyrics-head')) break
    }
  }

  toString() {}

  toJSON = makeToJSON()
}
