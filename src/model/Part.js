import Lexer from './Lexer'
import { makeToJSON } from '../utils/helpers'
import PartHead from './PartHead'
import Staff from './Staff'

export default class Part {
  constructor(part = { staves: [] }) {
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

  get isEmpty() {
    return this.staves.length === 1 && this.staves[0].cells.length === 0
  }

  parse(lexer) {
    this.head = lexer.is('part-head') ? new PartHead(lexer) : new PartHead()
    this.staves = []
    lexer.skipWhite()
    do {
      this.staves.push(new Staff(lexer))
    } while (lexer.is('--'))
    lexer.skipWhite()
  }

  stavesStr() { return this.staves.join('\n\n--\n') }

  singlePartToString() {
    return ('' + this.head) === '==' ? this.stavesStr() : this.toString()
  }

  toString() { return this.head +'\n' + this.stavesStr() }

  toJSON = makeToJSON('head', 'staves')
}
