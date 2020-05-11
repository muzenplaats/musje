import Lexer from './Lexer'
import { makeToJSON } from '../utils/helpers'
import Pitch from './Pitch'
import Duration from './Duration'
import Tie from './Tie'
import Tuplet from './Tuplet'
import Slur from './Slur'
import PlayStopHandleInterface from './PlayStopHandleInterface'

export default class Chord extends PlayStopHandleInterface {
  constructor(chord) {
    super()
    this.name = 'chord'
    if (chord.name === 'lexer') {
      this.parse(chord)
    } else if (typeof chord === 'string') {
      this.parse(new Lexer(chord))
    } else {
      this.pitches = chord.pitches.map(pitch => new Pitch(pitch))
      this.duration = new Duration(chord.duration)
      if (tie) this.tie = new Tie(tie)
      if (beginSlurs) this.beginSlurs = beginSlurs.map(slur => new Slur(slur))
      if (endSlurs) this.endSlurs = endSlurs.map(slur => new Slur(slur))
      if (tuplet) this.tuplet = tuplet
      if (lyrics) this.lyrics = lyrics.map(lyric => new Lyric(lyric))
    }
  }

  parse(lexer) {
    this.pitches = []

    while (lexer.is('(')) {
      this.beginSlurs = this.beginSlurs || []
      this.beginSlurs.push(new Slur(lexer))
    }
    while (lexer.is('[')) this.tuplet = new Tuplet(lexer)

    lexer.token('<')
    while (lexer.is('pitch')) this.pitches.push(new Pitch(lexer))
    lexer.token('>')
    this.duration = new Duration(lexer)
    if (lexer.is('~')) this.tie = new Tie(lexer)

    while (lexer.is('tuplet-end')) this.tuplet = new Tuplet(lexer)
    if (lexer.is('~')) this.tie = new Tie(lexer)
    while (lexer.is(')')) {
      this.endSlurs = this.endSlurs || []
      this.endSlurs.push(new Slur(lexer))
    }
  }

  defaultOnplay() {
    // this.pitches.forEach(pitch => pitch.onplay())
    this.duration.onplay()
    if (this.tie) this.tie.onplay()
    if (this.tuplet) this.tuplet.onplay()
    if (this.beginSlurs) this.beginSlurs.forEach(slur => slur.onplay())
    if (this.endSlurs) this.endSlurs.forEach(slur => slur.onplay())
  }

  defaultOnstop() {
    // this.pitches.forEach(pitch => pitch.onstop())
    this.duration.onstop()
    if (this.tie) this.tie.onstop()
    if (this.tuplet) this.tuplet.onstop()
    if (this.beginSlurs) this.beginSlurs.forEach(slur => slur.onstop())
    if (this.endSlurs) this.endSlurs.forEach(slur => slur.onstop())
  }

  toString() {
    const strs = []
    const { beginSlurs, endSlurs, tuplet, duration, tie } = this
    if (beginSlurs) strs.push(beginSlurs.join(''))
    if (tuplet && tuplet.type === 'begin') {
      strs.push(`[${duration.modification.actual}:`)
    }
    strs.push(`<${this.pitches.join('')}>${this.duration}`)
    if (tuplet && tuplet.type === 'end') strs.push(':]')
    if (endSlurs) strs.push(endSlurs.join(''))
    if (tie) strs.push(this.tie)
    return strs.join('')
  }

  toJSON = makeToJSON('pitches', 'duration', 'tuplet', 'tie',
                      'beginSlurs', 'endSlurs', 'lyric')
}
