const Lexer = require('../Lexer')
const { defaultIndentStep } = require('../helpers')

/*
  (Proof of concept component (not correct))
  Component := cap-ident S '{' NL
               indent(idntlevel) node-list '}' WS
  node-list := (Component(idntlevel) NL indent(idntlevel))*
 */
// export default class Component {
const Component = module.exports = class Component {
  constructor(src, indentLevel, indentStep = defaultIndentStep) {
    this.name = 'component'
    this.indentLevel = indentLevel
    this.indentStep = indentStep

    if (typeof src === 'string') {
      this.parse(new Lexer(src))
    } else if (src instanceof Lexer) {
      this.parse(src)
    } else {
      this.componentName = src.componentName
      this.content = src.content
    }
  }

  parse(lexer) {
    lexer.token('cap-ident', lexeme => { this.componentName = lexeme })

    lexer.token('S')
    lexer.token('{')
    // lexer.nextLine()


    lexer.mlwithout('}', lexeme => { this.content = lexeme })

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
