import Lexer from './Lexer'
import { makeToJSON } from '../utils/helpers'
import PartHead from './PartHead'
import Staff from './Staff'

export default class Part {
  constructor(part) {
    this.name = 'part'
    if (part.name === 'lexer') {
      this.parse(part)
    } else if (typeof part === 'string') {
      this.parse(new Lexer(part))
    } else {
      this.head = new PartHead(part.head)
      this.staves = part.staves.map(staff => new Staff(staff))
    }
  }

  parse(lexer) {
    this.head = new PartHead(lexer)
    this.staves = []
    while (!lexer.eof) {
      this.staves.push(new Staff(lexer))
    }
  }

  toString() {}
  toJSON = makeToJSON('head', 'staves')
}
