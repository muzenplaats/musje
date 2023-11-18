const Component = require('./Component')
const Lexer = require('../Lexer')
const { defaultIndentStep } = require('../helpers')


/*
  Document := WS Component
 */
const Document = module.exports = class Document {
  constructor(src, indentStep = defaultIndentStep) {
    this.name = 'document'
    this.indentStep = indentStep

    if (typeof src === 'string') {
      this.parse(new Lexer(src))
    } else if (src instanceof Lexer) {
      this.parse(src)
    } else {
      if (!src.nodeList) {
        throw new Error('Property nodeList required!')
      }
      this.nodeList = src.nodeList.map(rawNode => {
        if (rawNode.name === 'component') {
          return new Component(rawNode, 0, this.indentStep)
        }
        throw new TypeError('Unknown node for the document!')
      })
    }
  }

  parse(lexer) {
    this.nodeList = []
    lexer.skipWhite()

    if (!lexer.is('component')) {
      lexer.error('Root component required in the document!')
    }
    this.nodeList.push(new Component(lexer, 0, this.indentStep))
  }

  get rootComponent() {
    for (let node of this.nodeList) {
      if (node instanceof Component) {
        return node
      }
    }
    throw new Error('Root component not defined!')
  }

  toString() {
    return this.nodeList.join('')
  }

  toJSON() {
    const { name, nodeList } = this
    return { name, nodeList }
  }
}
