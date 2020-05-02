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
      this.abbreviation = head.abbreviation || ''
      this.midi = head.midi
    }
  }

  parse(lexer) {
    lexer.token('==')
    lexer.token('words', lexeme => { this.partName = lexeme.trim() })
    lexer.skipSS()
    this.abbreviation = ''
    if (lexer.is('(')) {
      lexer.token('(')
      lexer.token('abbreviation', lexeme => { this.abbreviation = lexeme })
      lexer.token(')')
    }
    if (lexer.is(':')) {
      lexer.token(':')
      lexer.skipSS()
      const midi = this.midi = {}
      lexer.token('midi')
      lexer.token('(')
      lexer.token('channel'); lexer.token(':'); lexer.skipSS()
      lexer.token('digits', lexeme => { midi.channel = +lexeme })
      lexer.token(','); lexer.skipSS()
      lexer.token('program'); lexer.token(':'); lexer.skipSS()
      lexer.token('digits', lexeme => { midi.program = +lexeme })
      lexer.token(','); lexer.skipSS()
      lexer.token('pan'); lexer.token(':'); lexer.skipSS()
      lexer.token('digits', lexeme => { midi.pan = +lexeme })
      lexer.token(')')
    }
    lexer.skipWhite()
  }

  toString() {
    const { partName, abbreviation, midi } = this
    const strs = ['==']
    if (partName) strs.push(partName)
    if (abbreviation) strs.push(`(${abbreviation})`)
    // if (strs.length > 1) strs[strs.length - 1] += ':'
    if (midi) {
      strs[strs.length - 1] += ':'
      const { channel, program, pan }  = midi
      const midiStrs = []
      if (typeof channel === 'number') midiStrs.push(`channel: ${channel}`)
      if (typeof program === 'number') midiStrs.push(`program: ${program}`)
      if (typeof pan === 'number') midiStrs.push(`pan: ${pan}`)
      strs.push(`midi(${midiStrs.join(', ')})`)
    }
    return strs.join(' ')
  }

  toJSON = makeToJSON('partName', 'midi')
}
