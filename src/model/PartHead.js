import Lexer from './Lexer'
import { makeToJSON } from '../utils/helpers'

export default class PartHead {
  constructor(head = {}) {
    this.name = 'part-head'
    if (head.name === 'lexer') {
      this.parse(head)
    } else if (typeof head === 'string') {
      this.parse(new Lexer(head))
    } else {
      this.partName = head.partName
      this.abbreviation = head.abbreviation
      this.midi = head.midi
    }
  }

  parse(lexer) {
    lexer.token('==')
  }

  toString() {
    const { partName, abbreviation, midi } = this
    const strs = ['==']
    if (partName) strs.push(partName)
    if (abbreviation) strs.push(`(${abbreviation})`)
    if (midi) {
      const { channel, program, pan }  = midi
      const midiStrs = []
      if (typeof channel === 'number') midiStrs.push(`channel:${channel}`)
      if (typeof program === 'number') midiStrs.push(`program:${program}`)
      if (typeof pan === 'number') midiStrs.push(`pan:${pan}`)
      strs.push(`midi(${midiStrs.join(', ')})`)
    }
    return strs.join(' ')
  }

  toJSON = makeToJSON('partName', 'midi')
}
