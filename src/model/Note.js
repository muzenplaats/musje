import { makeToJSON } from '../utils/helpers'
import Lexer from './Lexer'
import Pitch from './Pitch'
import Duration from './Duration'
import Lyric from './Lyric'

export default class Note {
  constructor(note) {
    this.name = 'note'
    if (note.name === 'lexer') {
      this.parse(note)
    } else if (typeof note === 'string') {
      this.parse(new Lexer(note))
    } else {
      const { pitch, duration, tuplet, lyric } = note
      this.pitch = new Pitch(pitch)
      this.duration = new Duration(duration)
      if (tuplet) this.tuplet = tuplet
      if (lyric) this.lyric = new Lyric(lyric)
    }
  }

  parse(lexer) {
    this.pitch = new Pitch(lexer)
    this.duration = new Duration(lexer)
  }

  onplay() { this.pitch.onplay(); this.duration.onplay() }
  onstop() { this.pitch.onstop(); this.duration.onstop() }

  toString() {
    const strs = []
    const { articulations, beginSlurs, endSlurs, tuplet, duration, tie } = this
    // if (beginSlurs) strs.push(beginSlurs.join(''))
    if (tuplet && tuplet.type === 'start') {
      strs.push(`(${duration.modification.actual}:`)
    }
    // if (articulations) strs.push(`x`)
    strs.push(`${this.pitch}${duration}`)
    if (tuplet && tuplet.type === 'stop') strs.push(':)')
    // if (endSlurs) strs.push(endSlurs.join(''))
    // if (tie) strs.push(this.tie)
    return strs.join('')
}
  toJSON = makeToJSON('pitch', 'duration', 'tuplet', 'lyric')
}
