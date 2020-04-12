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
      const { words, wedge, dynamics } = direction
      if (words) this.words = words
      if (wedge) this.wedge = wedge
      if (dynamics) this.dynamics = dynamics
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
    const { placement, words, wedge, dynamics } = this
    strs.push(placement === 'above' ? '/' : '\\')
    if (words) strs.push(words)
    if (wedge) strs.push(`wedge(${wedge})`)
    if (dynamics) strs.push(`dynamics(${dynamics})`)
    return strs.join('')
  }

  toJSON = makeToJSON('placement', 'words', 'wedge', 'dynamics')
}
