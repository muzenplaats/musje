import makeLexerClass from '../utils/makeLexerClass'
import { add, sub, mul, div, neg } from './operators'
import M from './M'

const Lexer = makeLexerClass({
  '(': '\\(',
  ')': '\\)',
  ',': ',',
  spaces: ' +',
  number: '\\d+\\.?\\d*[eE\\d]*',
  func: '[a-zA-Z\\d_]+\\(',
  ident: '[a-zA-Z][a-zA-Z\\d_]*',
  '-': '-',
  '+-': '[\\+\\-]',
  '*/': '[\\*\\/]',
  op: '[\\+\\-\\*\\/]',
  error: '.'
})

/*
 expr := term
 term := factor ('+-' factor)?
 factor := value ('* /' value)?
 value := number | func | ident | paran
 func := ident '(' expr (',' expr)* ')'
 paran := '(' expr ')'
 */
export default class {
  constructor(expr, idents = {}) {
    this.lexer = new Lexer(expr)
    this.idents = idents
    this.result = this.expression()
    if (this.lexer.is('error')) this.lexer.error('unknown')
  }

  ident(name) {
    const value = this.idents[name]
    if (value === undefined) throw new Error(`${name} is not defined`)
    return value
  }

  expression() {
    this.lexer.optional('spaces')
    return this.term()
  }

  term() {
    const { lexer } = this
    let result = this.factor()
    while (lexer.is('+-')) {
      lexer.token('+-', lexeme => {
        lexer.optional('spaces')
        switch (lexeme) {
          case '+': result = add(result, this.factor()); break
          case '-': result = sub(result, this.factor()); break
        }
      })
      lexer.optional('spaces')
    }
    return result
  }

  factor() {
    const { lexer } = this
    let result = this.value()
    while (lexer.is('*/')) {
      lexer.optional('*/', lexeme => {
        lexer.optional('spaces')
        switch (lexeme) {
          case '*': result = mul(result, this.value()); break
          case '/': result = div(result, this.value()); break
        }
      })
      lexer.optional('spaces')
    }
    return result
  }

  value() {
    const { lexer } = this
    let sign = false, result
    if (lexer.is('-')) lexer.token('-', () => { sign = true })
    if (lexer.is('number')) {
      lexer.token('number', lexeme => { result = +lexeme })
    } else if (lexer.is('func')) {
      result = this.func()
    } else if (lexer.is('ident')) {
      lexer.token('ident', lexeme => { result = this.ident(lexeme) })
    } else if (lexer.is('(')) {
      result = this.paran()
    } else {
      lexer.error('value')
    }
    lexer.optional('spaces')
    return sign ? neg(result) : result
  }

  func() {
    const { lexer } = this
    let funcName, plist = []
    lexer.token('ident', lexeme => { funcName = lexeme })
    lexer.token('(')
    lexer.optional('spaces')
    while (!lexer.is(')')) {
      plist.push(this.expression())
      if (!lexer.is(')')) lexer.token(',')
    }
    lexer.token(')')
    lexer.optional('spaces')
    return M[funcName].apply(null, plist)
  }

  paran() {
    const { lexer } = this
    lexer.token('(')
    lexer.optional('spaces')
    const result = this.expression()
    lexer.token(')')
    lexer.optional('spaces')
    return result
  }
}
