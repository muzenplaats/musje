import { makeToJSON } from './helpers'
import Lexer from './Lexer'
import Pitch from './Pitch'
import Duration from './Duration'

export default Note

class Note {
  constructor(note, style) {
    this.name = 'note'
    this.style = style
    if (note.name === 'lexer') {
      this.parse(note)
    } else if (typeof note === 'string') {
      this.parse(new Lexer(note))
    } else {
      this.pitch = note.pitch
      this.duration = note.duration
    }
  }

  parse(lexer) {
    this.pitch = new Pitch(lexer, this.style)
    this.duration = new Duration(lexer, this.style)
    lexer.skipSS()
  }

  toString() { return `${pitch}${duration}`}
  toJSON = makeToJSON('pitch', 'duration')
}
