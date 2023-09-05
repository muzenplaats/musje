import Lexer from './Lexer'
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
    this.list = []
    let lyric, prev

    lexer.token('lyrics-head')
    lexer.skipWhite()

    while (!lexer.eof && !lexer.is('lyrics-head') && !lexer.is('staff-head') && !lexer.is('part-head')) {
      if (lexer.is('lyric-control')) {
        this.list.push(new LyricControl(lexer))
      } else {
        lyric = new Lyric(lexer, prev)
        this.list.push(lyric)
        prev = lyric
      }

      lexer.skipWhite()
    }
  }

  toString() {}

  toJSON() {

  }
}
