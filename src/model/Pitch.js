import Lexer from './Lexer'
import { makeToJSON, repeat } from '../utils/helpers'
import PlayStopHandleInterface from './PlayStopHandleInterface'
import Scale from '../scale/Scale'

const STEP_TO_SEMITONE = { 1: 0, 2: 2, 3: 4, 4: 5, 5: 7, 6: 9, 7: 11 }
const ACCIDENTAL_TO_ALTER = {
  '#': 1, '##': 2, n: 0, '': 0, b: -1, bb: -2
}

export default class Pitch extends PlayStopHandleInterface {
  constructor(pitch) {
    super()
    this.name = 'pitch'
    if (pitch.name === 'lexer') {
      this.parse(pitch)
    } else if (typeof pitch === 'string') {
      this.parse(new Lexer(pitch))
    } else {
      this.step = pitch.step || 1
      this.accidental = pitch.accidental || ''
      this.octave = pitch.octave || 0
      this.midiNumber = pitch.midiNumber
      // this.sclName = pitch.sclName || ''
      // this.sclStep = pitch.sclStep
    }
  }

  parse(lexer) {
    lexer.optional('accidental', lexeme => { this.accidental = lexeme })
    lexer.token('step', lexeme => { this.step = +lexeme })
    lexer.optional('octave', lexeme => {
      this.octave = lexeme[0] === `'` ? lexeme.length :
                    lexeme[0] === ',' ? -lexeme.length : 0
    })
  }

  get alter() {
    return typeof this._alter === 'number' ? this._alter :
           ACCIDENTAL_TO_ALTER[this.accidental]
  }
  set alter(alt) { this._alter = alt }

  get midiNumber() {
    return STEP_TO_SEMITONE[this.step] + this.alter + this.octave * 12 + 60
  }
  set midiNumber(num) {
    // Todo
  }

  get frequency() {
    // return this.sclName ?
    //     (this.sclStep ? new Scale(this.sclName, this.sclStep).frequency :
    //                     this.detune())
    //   : Math.pow(2, (this.midiNumber - 69) / 12) * 440
  }

  // // Usage: with sclName but without sclStep.
  // detune() { return new Scale().detune(this.midiNumber) }   // string~>piano

  // // Tune scale.frequency to the 23-tone TET; to go with piano.
  // tune() { return new Scale().tune(this.midiNumber) }   //

  defaultOnplay() { if (this.tie) this.tie.onplay() }
  defaultOnstop() { if (this.tie) this.tie.onstop() }

  toString() {
    const { step, accidental, octave } = this
    const oct = octave > 0 ? repeat('\'', octave) : repeat(',', -octave)
    return `${accidental}${step}${oct}`
  }

  toJSON = makeToJSON('step', 'accidental', 'octave')
}

// Current usage for a sequencer:
// pitch.midiNumber
// pitch.frequency
// (possible addon)
// pitch.sclName(step)
// (my goal is let the midiNuber and sclName(step) branches..)
// (result in the only pitch.frequency, by a preference of an instence.)
// (My brain is Empty now; goed zo!)
