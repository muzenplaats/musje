import Lexer from './Lexer'
import { makeToJSON } from '../utils/helpers'

export default Cell

class Cell {
  constructor(cell, style) {
    this.name = 'cell'
    this.style = style
    if (cell.name = 'lexer') {
      this.parse(cell)
    } else if (typeof cell === 'string') {
      this.parse(new Lexer(cell))
    } else {
      this.data = cell.data
    }
  }

  parse(lexer) {

  }

  toString() { return this.data.join(' ') }
  toJSON = makeToJSON('data')
}
