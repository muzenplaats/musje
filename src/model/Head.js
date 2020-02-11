import Lexer from './Lexer'
import { makeToJSON } from '../utils/helpers'

export default Head

class Head {
  constructor(head, style) {
    this.name = 'head'
    this.style = style
    if (head.name === 'lexer'){
      this.parse(head)
    } else if (typeof head === 'string') {
      this.parse(new Lexer(head))
    } else {
      this.title = title
      this.subtitle = subtitle
      this.composer = composer
      this.lyricist = lyricist
      this.arranger = arranger
      this.source = source
    }
  }

  parse(lexer) {

  }

  toString() {}
  toJSON = makeToJSON('title', 'subtitle', 'composer', 'lyricist',
                      'arranger', 'source')
}
