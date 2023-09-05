import Lexer from './Lexer'
import { swapObject } from '../utils/helpers'

const INSTRUCTION_NAMES = { '@': 'at', '+': 'forward', '-': 'backward' }
const INSTRUCTION_SYMBOLS = swapObject(INSTRUCTION_NAMES)
const QUARTER_CONVERTER = { w: 4, h: 2, q: 1, e: 0.5 }


export default class LyricControl {
  constructor(control) {
    this.name = 'lyric-control'

    if (control.name === 'lexer') {
      this.parse(control)
    } else if (typeof control === 'string') {
      this.parse(new Lexer(control))
    } else {
      this.instruction = control.instruction
      this.measureAmount = control.measureAmount
      this.typeData = control.typeData
      this.noteAmount = control.noteAmount
    }
  }

  parse(lexer) {
    lexer.token('lyric-control-symbol', lexeme => {
      this.instruction = INSTRUCTION_NAMES[lexeme]
    })

    if (lexer.is('digits')) {
      this.type = 'note'
      lexer.token('digits', lexeme => { this.amount = +lexeme})
    } else if (lexer.is('m')) {
      this.type = 'measure'
      lexer.token('m')
      lexer.token('digits', lexeme => { this.amount = +lexeme })
    } else {
      lexer.error('lyric-control parameters')
    }
  }

  toString() {
    let str = INSTRUCTION_SYMBOLS[this.instruction]

    if (this.type === 'note') {
      str += this.amount
    } else if (this.type === 'measure') {
      str += `m${this.amount}`
    }

    return str
  }

  toJSON() {
    const { measureAmount, typeData, noteAmount } = this
    return { measureAmount, typeData, noteAmount }
  }
}
