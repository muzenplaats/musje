import Lexer from './Lexer'
import { repeat, range, swapObject } from '../utils/helpers'
import { Q } from './constants'
import PlayStopHandleInterface from './PlayStopHandleInterface'

const STR_TO_TYPE = {
  '---': 1, '-': 2, '': 4, '_': 8, '=': 16, '=_': 32, '==': 64,
  '==_': 128, '===': 256, '===_': 512, '====': 1024
}

const TYPE_TO_STR = swapObject(STR_TO_TYPE)

const DOTS_MULTIPLIERS = [1, 1.5, 1.75]


/**
 * Duration := type? dots?
 * type := '(---|-|={0,5}_|={1,5})'
 * dots := '\\.{1,2}'
 **/
export default class Duration extends PlayStopHandleInterface {
  constructor(duration) {
    super()
    this.name = 'duration'

    if (duration.name === 'lexer') {
      this.parse(duration)
    } else if (typeof duration === 'string') {
      this.parse(new Lexer(duration))
    } else {
      this.type = duration.type || 4
      this.dots = duration.dots || 0
      this.modification = duration.modification
    }

    if (this.type > 4) this.initBeams()
  }

  initBeams() {
    this.numBeams = Math.log2(this.type) - 2
    this.beams = range(this.numBeams).map(() => ({ type: 'single' }))
  }

  parse(lexer) {
    lexer.optional('type', lexeme => { this.type = STR_TO_TYPE[lexeme] })
    lexer.optional('dots', lexeme => { this.dots = lexeme.length })
  }

  get quartersQ() {
    const mod = this.modification
    return Q * 4 / this.type * DOTS_MULTIPLIERS[this.dots] *
           (mod ? mod.normal / mod.actual : 1)
  }

  get quarters() { 
    return this.quartersQ / Q 
  }

  toString() { 
    return `${TYPE_TO_STR[this.type]}${repeat('.', this.dots)}` 
  }

  toJSON() {
    const { type, dots, modification } = this
    return { type, dots, modification }
  }
}
