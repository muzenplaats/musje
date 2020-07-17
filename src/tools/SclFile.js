inmport fs from 'fs'
import makeLexerClass from '../utils/makeLexerClass'
import { makeToJSON } from '../utils/helpers'

const Lexer = makeLexerClass({
  '!': '!',
  comment: '!'
})

export default class SclFile {
  constructor(sclName) {
    this.name = 'scl-file'
    const src = fs.readfileSync(sclName + '.scl')
    this.parse(new Lexer(src))
  }

  parse(lexer) {
    if (lexer.is('comment')) {
      new Comment(lexer)
    }
  }

  toString() { /* *.csv?? */}
  toJSON = makeToJSON('')
}

class Comment {
  constructor(lexer) {
    this.name = 'comment'
    this.parse(lexer)
  }

  parse(lexer) {
    lexer.token('!')
    lexer.optional('ALL')
    if (!lexer.eof) lexer.nextline()
  }
}



