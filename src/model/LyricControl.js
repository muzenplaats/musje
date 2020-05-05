import Lexer from './Lexer'
import { makeToJSON, swapObject } from '../utils/helpers'

const INSTRUCTION_NAMES = { '@': 'at', '+': 'increase', '-': 'decrease' }
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
    const parseType = () => {
      const typeData = this.typeData = {}
      lexer.token('[whqe]', lexeme => { typeData.abbr = lexeme })
      lexer.token('digit', lexeme => { typeData.amount = +lexeme })
      typeData.quarters = QUARTER_CONVERTER[typeData.abbr] * typeData.amount
    }

    lexer.token('lyric-control', lexeme => {
      this.instruction = INSTRUCTION_NAMES[lexeme]
    })
    if (lexer.is('digits')) {
      lexer.token('digits', lexeme => { this.noteAmount = lexeme})
    } else if (lexer.is('[whqe]')) {
      parseType()
    } else if (lexer.is('m')) {
      lexer.token('m')
      lexer.token('digits', lexeme => { this.measureAmount = +lexeme })
      if (lexer.is('[whqe]')) parseType()
    }

    // console.log(this, '' + this)
  }

  toString() {
    let str = INSTRUCTION_SYMBOLS[this.instruction]
    if (this.noteAmount) {
      str += this.noteAmount
    } else {
      if (this.measureAmount) str += `m${this.measureAmount}`
      if (this.typeData) str += `${this.typeData.abbr}${this.typeData.amount}`
    }
    return str
  }

  toJSON = makeToJSON('measureAmount', 'typeData', 'noteAmount')
}
