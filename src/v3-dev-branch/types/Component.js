// import Lexer from '../Lexer')
// import { mltrimleft } = from '../helper'

const Lexer = require('../Lexer')
const { mltrimleft } = require('../helpers')

/*
  (Proof of concept component (not correct))
  Component := cap-ident WS '{'  mlwithout-'}'   '}' WS
 */
// export default class Component {
const Component = module.exports = class Component {
  constructor(src) {
    this.name = 'component'
    this.src = src

    if (typeof src === 'string') {
      this.parse(new Lexer(src))
    } else if (src instanceof Lexer) {
      this.parse(src)
    } else {
      // ...
    }
  }

  parse(lexer) {
    lexer.token('cap-ident', lexeme => { this.componentName = lexeme })

    lexer.skipWhite()
    lexer.token('{')

    lexer.mlwithout('}', lexeme => { this.content = mltrimleft(lexeme) })

    lexer.token('}')
    lexer.skipWhite()

    if (!lexer.eof) {
      lexer.error('Parsing not finished!')
    }
  }

  toString() {
    const strs = [this.componentName]
    strs.push(' ')
    strs.push('{')
    strs.push(this.content)
    strs.push('}')

    return strs.join('')
  }

  toJSON() {
    const { name, componentName, content } = this
    return { name, componentName, content }
  }
}
