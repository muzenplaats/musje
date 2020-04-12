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
      const { pitch, duration, lyric } = note
      this.pitch = new Pitch(pitch)
      this.duration = new Duration(duration)
      if (lyric) this.lyric = new Lyric(lyric)
    }
  }

  parse(lexer) {
    this.pitch = new Pitch(lexer)
    this.duration = new Duration(lexer)
  }

  onplay() { this.pitch.onplay(); this.duration.onplay() }
  onstop() { this.pitch.onstop(); this.duration.onstop() }

  toString() { return `${this.pitch}${this.duration}` }
  toJSON = makeToJSON('pitch', 'duration', 'lyric')
}
