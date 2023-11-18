// import Component from './Component'
// import Lexer from '../Lexer'

const Component = require('./Component')
const Lexer = require('../Lexer')


/*
  Document := WS Component
 */
// export default class Document {
const Document = module.exports = class Document {
  constructor(src) {
    this.name = 'document'
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
    this.nodeList = []
    lexer.skipWhite()  // this is not in the grammar but for the test.

    if (!lexer.is('component')) {
      lexer.error('Root component required in the document!')
    }
    this.nodeList.push(new Component(lexer))
  }

  get rootComponent() {
    for (node of this.nodeList) {
      if (node instanceof Component) {
        return node
      }
    }
    throw new Error('Root component not defined!')
  }

  toString() {
    // ...
  }

  toJSON() {
    const { name } = this
    return { name }
  }
}




// Quick-and-dirty test:

const testDoc = doc => {
  console.log()
  console.log('- Source:')
  console.log(doc.src)
  console.log()
  console.log('- Data:')
  console.log(JSON.stringify(doc, null, 2))
  console.log()
  console.log('- Description:')
  console.log('' + doc)
  console.log()
}

const abc = new Document('Abc {...}')
testDoc(abc)
const def = new Document(`
Def {
  FakeChildComponent {
    This is fake for test.
  )]
}
`)
testDoc(def)

