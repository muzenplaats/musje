import Lexer from './Lexer'
import { makeToJSON } from '../utils/helpers'
import Cell from './Cell'

export default class Staff {
  constructor(staff, style) {
    this.name = 'staff'
    this.style = style
    if (staff.name === 'lexer') {
      this.parse(staff)
    } else if (typeof staff === 'string') {
      this.parse(new Lexer(staff))
    } else {
      this.cells = staff.cells.map(cell => new Cell(cell))
    }
  }

  parse(lexer) {
    this.cells = []
    while (lexer.is('cell')) {
      this.cells.push(new Cell(lexer))
    }
  }

  toString() { return this.cells.join(' ') }
  toJSON = makeToJSON('cells')
}
