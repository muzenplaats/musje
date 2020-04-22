import { makeToJSON } from '../utils/helpers'
import Lexer from './Lexer'
import Pitch from './Pitch'
import Duration from './Duration'
import Tie from './Tie'
import Slur from './Slur'
import Lyric from './Lyric'

export default class Note {
  constructor(note) {
    this.name = 'note'
    if (note.name === 'lexer') {
      this.parse(note)
    } else if (typeof note === 'string') {
      this.parse(new Lexer(note))
    } else {
      this.pitch = new Pitch(note.pitch, style)
      this.duration = new Duration(note.duration, style)
      this.articulations = note.articulations
      this.tie = note.tie
      this.beginSlurs = note.beginSlurs
      this.endSlurs = note.endSlurs
      this.tuplet = note.tuplet
      this.lyric = note.lyric
    }
  }

  parse(lexer) {
    while (lexer.is('(')) {
      this.beginSlurs = this.beginSlurs || []
      this.beginSlurs.push(new Slur(lexer))
    }
    this.pitch = new Pitch(lexer)
    this.duration = new Duration(lexer)
    if (lexer.is('~')) this.tie = new Tie(lexer)
    while (lexer.is(')')) {
      this.endSlurs = this.endSlurs || []
      this.endSlurs.push(new Slur(lexer))
    }
  }

  onplay() {
    this.pitch.onplay()
    this.duration.onplay()
    if (this.tie) this.tie.onplay()
    if (this.beginSlurs) this.beginSlurs.forEach(slur => slur.onplay())
    if (this.endSlurs) this.endSlurs.forEach(slur => slur.onplay())
  }

  onstop() {
    this.pitch.onstop()
    this.duration.onstop()
    if (this.tie) this.tie.onstop()
    if (this.beginSlurs) this.beginSlurs.forEach(slur => slur.onstop())
    if (this.endSlurs) this.endSlurs.forEach(slur => slur.onstop())
  }

  toString() {
    const strs = []
    const { articulations, beginSlurs, endSlurs, tuplet, duration, tie } = this
    if (beginSlurs) strs.push(beginSlurs.join(''))
    if (tuplet && tuplet.type === 'start') {
      strs.push(`(${duration.modification.actual}:`)
    }
    if (articulations) strs.push('x')
    strs.push(`${this.pitch}${duration}`)
    if (tuplet && tuplet.type === 'stop') strs.push(':)')
    if (endSlurs) strs.push(endSlurs.join(''))
    if (tie) strs.push(this.tie)
    return strs.join('')
}
  toJSON = makeToJSON('pitch', 'duration', 'tie', 'tuplet', 'lyric')
}
