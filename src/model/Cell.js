import Lexer from './Lexer'
import { makeToJSON } from '../utils/helpers'
import Time from './Time'
import Note from './Note'
import Rest from './Rest'
import Chord from './Chord'
import Bar from './Bar'

export default class Cell {
  constructor(cell, style) {
    this.name = 'cell'
    this.style = style
    if (cell.name === 'lexer') {
      this.parse(cell)
    } else if (typeof cell === 'string') {
      this.parse(new Lexer(cell))
    } else {
      this.data = cell.data.map(dt => {
        switch (dt.name) {
          case 'time': return new Time(dt)
          case 'note': return new Note(dt)
          case 'rest': return new Rest(dt)
          case 'chord': return new Chord(dt)
          case 'bar': return new Bar(dt)
          default: throw new Error(`Music data: ${dt}`)
        }
      })
    }
  }

  parse(lexer) {
    this.data = []
    while(!lexer.eof) {
      if (lexer.is('time')) {
        this.data.push(new Time(lexer))
      } else if (lexer.is('note')) {
        this.data.push(new Note(lexer))
      } else if (lexer.is('rest')) {
        this.data.push(new Rest(lexer))
      } else if (lexer.is('chord')) {
        this.data.push(new Chord(lexer))
      } else if (lexer.is('bar')) {
        this.data.push(new Bar(lexer))
        lexer.skipWhite(); break
      } else {
        lexer.skipWhite(); break
      }
      lexer.skipWhite()
    }
  }

  toString() { return this.data.join(' ') }
  toJSON = makeToJSON('data')
}
