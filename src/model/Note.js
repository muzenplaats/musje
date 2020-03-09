import { makeToJSON } from '../utils/helpers'
import Lexer from './Lexer'
import Pitch from './Pitch'
import Duration from './Duration'

export default class Note {
  constructor(note, style) {
    this.name = 'note'
    this.style = style
    if (note.name === 'lexer') {
      this.parse(note)
    } else if (typeof note === 'string') {
      this.parse(new Lexer(note))
    } else {
      this.pitch = new Pitch(note.pitch, style)
      this.duration = new Duration(note.duration, style)
    }
  }

  parse(lexer) {
    this.pitch = new Pitch(lexer, this.style)
    this.duration = new Duration(lexer, this.style)
  }

  onplay() { this.pitch.onplay(); this.duration.onplay() }
  onstop() { this.pitch.onstop(); this.duration.onstop() }

  toString() { return `${this.pitch}${this.duration}`}
  toJSON = makeToJSON('pitch', 'duration')
}
