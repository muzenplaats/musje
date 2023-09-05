import Lexer from './Lexer'
import Note from './Note'
import Rest from './Rest'
import Chord from './Chord'
import Direction from './Direction'

export default class Layer {
  constructor(layer) {
    this.name = 'layer'

    if (layer.name === 'lexer') {
      this.parse(layer)
    } else if (typeof layer === 'string') {
      this.parse(new Lexer(layer))
    } else {
      this.data = layer.data.map(dt => {
        switch (dt.name) {
          case 'note': return new Note(dt)
          case 'rest': return new Rest(dt)
          case 'chord': return new Chord(dt)
          case 'direction': return new Direction(dt)
          default: throw new Error(`Music data: ${dt}`)
        }
      })
    }
  }

  parse(lexer) {
    this.data = []

    while(!lexer.eof) {
      if (lexer.is('note')) {
        this.data.push(new Note(lexer))
      } else if (lexer.is('rest')) {
        this.data.push(new Rest(lexer))
      } else if (lexer.is('chord')) {
        this.data.push(new Chord(lexer))
      } else if (lexer.is('direction')) {
        this.data.push(new Direction(lexer))
      } else if (lexer.is('|')) {
        lexer.token('|')
        lexer.skipWhite(); break
      } else if (lexer.is('>')) {
        break
      } else {
        lexer.error('music data in layer')
      }

      lexer.skipWhite()
    }
  }

  toString() {
    return this.data.join(' ')
  }

  toJSON() {
    const { data } = this
    return { data }
  }
}
