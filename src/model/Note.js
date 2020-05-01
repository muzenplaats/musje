import { makeToJSON } from '../utils/helpers'
import Lexer from './Lexer'
import Pitch from './Pitch'
import Duration from './Duration'
import Tie from './Tie'
import Slur from './Slur'
import Tuplet from './Tuplet'
import Lyric from './Lyric'

export default class Note {
  constructor(note) {
    this.name = 'note'
    if (note.name === 'lexer') {
      this.parse(note)
    } else if (typeof note === 'string') {
      this.parse(new Lexer(note))
    } else {
      const { pitch, duration, articulations, tie, beginSlurs, endSlurs, tuplet, lyrics } = note
      this.pitch = new Pitch(pitch)
      this.duration = new Duration(duration)
      if (articulations) this.articulations = articulations
      if (tie) this.tie = new Tie(tie)
      if (beginSlurs) this.beginSlurs = beginSlurs.map(slur => new Slur(slur))
      if (endSlurs) this.endSlurs = endSlurs.map(slur => new Slur(slur))
      if (tuplet) this.tuplet = tuplet
      if (lyrics) this.lyrics = lyrics.map(lyric => new Lyric(lyric))
    }
  }

  parse(lexer) {
    while (lexer.is('[')) {
      if (lexer.is('tuplet-begin')) {
        this.tuplet = new Tuplet(lexer)
      } else {
        this.beginSlurs = this.beginSlurs || []
        this.beginSlurs.push(new Slur(lexer))
      }
    }
    this.pitch = new Pitch(lexer)
    this.duration = new Duration(lexer)
    while (lexer.is('tuplet-end')) {
      this.tuplet = new Tuplet(lexer)
    }
    while (lexer.is(')')) {
      this.endSlurs = this.endSlurs || []
      this.endSlurs.push(new Slur(lexer))
    }
    if (lexer.is('~')) this.tie = new Tie(lexer)
  }

  get onplay() { return this._onplay || this.defaultOnplay.bind(this) }
  set onplay(newf) {
    const oldf = this.onplay
    this._onplay = () => { oldf(); newf() }
  }
  get onstop() { return this._onstop || this.defaultOnstop.bind(this) }
  set onstop(newf) {
    const oldf = this.onstop
    this._onstop = () => { oldf(); newf() }
  }

  defaultOnplay() {
    this.pitch.onplay()
    this.duration.onplay()
    if (this.tie) this.tie.onplay()
    if (this.tuplet) this.tuplet.onplay()
    if (this.beginSlurs) this.beginSlurs.forEach(slur => slur.onplay())
    if (this.endSlurs) this.endSlurs.forEach(slur => slur.onplay())
  }

  defaultOnstop() {
    this.pitch.onstop()
    this.duration.onstop()
    if (this.tie) this.tie.onstop()
    if (this.tuplet) this.tuplet.onstop()
    if (this.beginSlurs) this.beginSlurs.forEach(slur => slur.onstop())
    if (this.endSlurs) this.endSlurs.forEach(slur => slur.onstop())
  }

  toString() {
    const strs = []
    const { articulations, beginSlurs, endSlurs, tuplet, duration, tie } = this
    if (beginSlurs) strs.push(beginSlurs.join(''))
    if (tuplet && tuplet.type === 'begin') {
      strs.push(`[${duration.modification.actual}:`)
    }
    if (articulations) strs.push('x')
    strs.push(`${this.pitch}${duration}`)
    if (tuplet && tuplet.type === 'end') strs.push(':]')
    if (endSlurs) strs.push(endSlurs.join(''))
    if (tie) strs.push(this.tie)
    return strs.join('')
}
  toJSON = makeToJSON('pitch', 'duration', 'tie', 'tuplet', 'lyric')
}
