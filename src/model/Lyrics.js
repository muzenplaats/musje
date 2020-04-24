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
  }

  parse(lexer) {
    lexer.token('lyrics')
    lexer.token(':')
    lexer.skipWhite()
    this.list = []
    let lyric, prevLyric
    while (lexer.is('word')) {
      lyric = new Lyric(lexer, prevLyric)
      this.list.push(lyric)
      prevLyric = lyric
      lexer.skipWhite()
    }
  }

  toString() {

  }

  toJSON = makeToJSON()
}
