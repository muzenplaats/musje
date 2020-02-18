import Lexer from './Lexer'
import { makeToJSON } from '../utils/helpers'

export default class Direction {
  constructor(direction) {
    this.name = 'direction'
    if (direction.name === 'lexer') {
      this.parse(direction)
    } else if (typeof direction === 'string') {
      this.parse(new Lexer(direction))
    } else {
      this.placement = direction.placement
      this.words = direction.words
    }
  }

  parse(lexer) {
    lexer.token('/\\', lexeme => {
      this.placement = lexeme === '/' ? 'above' : 'below'
    })
    lexer.token('words', lexeme => { this.words = lexeme.trim() })
  }

  toString() {
    const strs = []
    strs.push(this.placement === 'above' ? '/' : '\\')
    strs.push(this.words)
    return strs.join('')
  }

  toJSON = makeToJSON('placement', 'words')
}
