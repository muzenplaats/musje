const makeLexerClass = require('./lib/makeLexerClass')


/*
  Def {
    abc
    defg
     hi
  }
  return
`abc
defg
 hi  `
 */
const mltrim /* mltrimleft or so */ = str => {
  // todo: something like this name but maybe wrong
  return str
}



const Lexer = makeLexerClass({
  '{': '\{',
  '}': '\}',
  'cap-ident': '[A-Z][a-zA-Z\\d_]*'
})

/*
  (Proof of concept component (not correct))
  Component := cap-ident WS '{'  mlwithout-'}'   '}' WS
 */
class Component {
  constructor(src) {
    this.name = 'component'
    this.src = src
    this.parse(new Lexer(src))
  }

  parse(lexer) {
    lexer.skipWhite()  // this is not in the grammar but for the test.

    lexer.token('cap-ident', lexeme => { this.componentName = lexeme })

    lexer.skipWhite()
    lexer.token('{')

    lexer.mlwithout('}', lexeme => { this.content = mltrim(lexeme) })

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



// Quick-and-dirty test:

const testComp = comp => {
  console.log()
  console.log('- Source:')
  console.log(comp.src)
  console.log()
  console.log('- Data:')
  console.log(JSON.stringify(comp, null, 2))
  console.log()
  console.log('- Description:')
  console.log('' + comp)
  console.log()
}

const abc = new Component('Abc {...}')
testComp(abc)
const def = new Component(`
Def {
  FakeChildComponent {
    This is fake for test.
  )]
}
`)
testComp(def)


///////////////
/*
class Data {
  // Don't know; leave it for later...
}


class Component extends Data {
  constructor(src) {
    this.name = 'component'
  }


  toJSON() {
    cons { name } from this
    return { name }yeyoucanselike
  }
}
*/

