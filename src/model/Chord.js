import Lexer from './Lexer'
import { makeToJSON } from '../utils/helpers'
import Pitch from './Pitch'
import Duration from './Duration'
import Tie from './Tie'
import Slur from './Slur'

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

  onplay() {
    this.pitches.forEach(pitch => pitch.onplay())
    this.duration.onplay()
  }

  onstop() {
    this.pitches.forEach(pitch => pitch.onstop())
    this.duration.onstop()
  }

  parse(lexer) {
    this.pitches = []
    lexer.token('<')
    while (lexer.is('pitch')) this.pitches.push(new Pitch(lexer))
    lexer.token('>')
    this.duration = new Duration(lexer)
    if (lexer.is('~')) this.tie = new Tie(lexer)
  }

  toString() {
    const strs = []
    const { tuplet, duration, tie } = this
    if (tuplet === 'start') strs.push(`(${duration.modification.actual}:`)
    strs.push(`<${this.pitches.join('')}>${this.duration}`)
    if (tuplet === 'stop') strs.push(':)')
    if (tie) strs.push(this.tie)
    return strs.join('')
  }

  toJSON = makeToJSON('pitches', 'duration', 'tuplet', 'tie')
}
