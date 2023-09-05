import Lexer from './Lexer'

/**
 * Head := (name value WS)*
 * name := 'title:' | 'subtitle:' | 'composer:' | 'lyricist:' | 'arranger:'
 * value := without-comment
 * => Head {
 *   title: String,
 *   subtitle: String,
 *   composer: String,
 *   lyricist: String,
 *   arranger: String,
 *   source: String
 * }
 **/
export default class Head {
  constructor(head = {}) {
    this.name = 'head'

    if (head.name === 'lexer'){
      this.parse(head)
    } else if (typeof head === 'string') {
      this.parse(new Lexer(head))
    } else {
      this.title = head.title
      this.subtitle = head.subtitle
      this.composer = head.composer
      this.lyricist = head.lyricist
      this.arranger = head.arranger
      this.source = head.source
    }
  }

  parse(lexer) {
    const process = name => {
      lexer.token(name)
      lexer.without('comment', lexeme => { this[name] = lexeme.trim() })
    }

    while (!lexer.eof) {
      if (lexer.is('title')) {
        process('title')
      } else if (lexer.is('subtitle')) {
        process('subtitle')
      } else if (lexer.is('composer')) {
        process('composer')
      } else if (lexer.is('lyricist')) {
        process('lyricist')
      } else if (lexer.is('arranger')) {
        process('arranger')
      } else if (lexer.is('source')) {
        process('source')
      } else {
        break
      }
      lexer.skipWhite()
    }
  }

  toString() {
    const strs = []

    if (this.title) strs.push(`title: ${this.title}`)
    if (this.subtitle) strs.push(`subtitle: ${this.subtitle}`)
    if (this.composer) strs.push(`composer: ${this.composer}`)
    if (this.lyricist) strs.push(`lyricist: ${this.lyricist}`)
    if (this.arranger) strs.push(`arranger: ${this.arranger}`)
    if (this.source) strs.push(`source: ${this.source}`)

    return strs.join('\n')
  }

  toJSON() {
    const { title, subtitle, composer, lyricist, arranger, source } = this
    return { title, subtitle, composer, lyricist, arranger, source }
  }
}
