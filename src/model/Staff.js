import Lexer from './Lexer'
import { makeToJSON } from '../utils/helpers'
import { Q } from './constants'
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
    this.setT()
  }

  parse(lexer) {
    this.cells = []
    while (lexer.is('cell')) {
      this.cells.push(new Cell(lexer))
    }
  }

  setT() {
    const tempo = 150
    let t = 0, tQ = 0
    this.cells.forEach(cell => {
      cell.data.forEach(dt => {
        dt.t = t
        dt.tQ = tQ
        if (dt.duration) {
          const dur = dt.duration.quarter * 60 / tempo
          dt.duration.second = dur
          t += dur
          tQ += dt.duration.quarterQ
        }
      })
    })
  }

  toString() { return this.cells.join(' ') }
  toJSON = makeToJSON('cells')
}
