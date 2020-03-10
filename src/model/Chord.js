import Lexer from './Lexer'
import { makeToJSON } from '../utils/helpers'
import Pitch from './Pitch'
import Duration from './Duration'

export default class Chord {
  constructor(chord) {
    this.name = 'chord'
    if (chord.name === 'lexer') {
      this.parse(chord)
    } else if (typeof chord === 'string') {
      this.parse(new Lexer(chord))
    } else {
      this.pitches = chord.pitches.map(pitch => new Pitch(pitch))
      this.duration = new Duration(chord.duration)
    }
  }

  parse(lexer) {
    this.pitches = []
    lexer.token('<')
    while (lexer.is('pitch')) this.pitches.push(new Pitch(lexer))
    lexer.token('>')
    this.duration = new Duration(lexer)
  }

  toString() { return `<${this.pitches.join('')}>${this.duration}` }
  toJSON = makeToJSON('pitches', 'duration')
}
