import makeLexerClass from './makeLexerClass'
import { makeToJSON } from './helpers'

const Lexer = makeLexerClass({
  '<': '<',
  '>': '>',
  '</': '</',
  '/>': '/>',
  '=': '=',
  '"': '"',
  '<?xml': '<\\?xml',
  '?>': '\\?>',
  '<!--': '<!--',
  '-->': '-->',
  name: '[a-z_-]+'
})

export default class Document {
  constructor(document) {
    this.name = 'document'
    if (document.name === 'lexer') {
      this.parse(document)
    } else if (typeof document === 'string') {
      this.parse(new Lexer(document))
    } else {
      this.xmlDecl = new XmlDecl(document.xmlDecl)
      this.doctype = new Doctype(document.doctype)
      this.root = new Element(document.root)
    }
  }

  parse(lexer) {

  }

  toString() {}
  toJSON = makeToJSON('xmlDecl', 'doctype', 'root')
}

class XmlDecl {
  constructor(xmlDecl) {
    this.name = 'xml-decl'
    if (xmlDecl.name === 'lexer') {
      this.parse(xmlDecl)
    } else if (typeof xmlDecl === 'string') {
      this.parse(new Lexer(xmlDecl))
    } else {
      this.attrs = new Attrs(xmlDecl.attrs)
    }
  }

  parse(lexer) {

  }

  toString() { `<!` }
  toJSON = makeToJSON('attrs')
}

class Doctype {
  constructor(doctype) {
    this.name = 'doctype'
    if (doctype.name === 'lexer') {
      this.parse(doctype)
    } else if (typeof doctype === 'string') {
      this.parse(new Lexer(doctype))
    } else {
      this.value = doctype.value
    }
  }

  parse(lexer) {

  }

  toString() {}
  toJSON = makeToJSON('value')
}

class Element {
  constructor(element) {
    this.name = 'element'
    if (element.name === 'lexer') {
      this.parse(element)
    } else if (typeof element === 'string') {
      this.parse(new Lexer(element))
    } else {
      this.elName = element.elName
      this.attrs = new Attrs(element.attrs)
      this.content = []
      element.content.forEach(child => {
        if (typeof child === 'string') {
          this.content.push(child)
        } else if (child.name === 'element') {
          this.content.push(new Element(child))
        } else if (child.name === 'comment') {

        }
      })
    }
  }

  parse(lexer) {
    this.content = []
    lexer.token('<')
    lexer.token('name', lexeme => { this.elName = lexeme })
    lexer.skipWhite()
    if (lexer.is('name')) this.attrs = new Attrs(lexer)
    if (lexer.is('/>')) { lexer.token('/>'); return }
    lexer.token('>')

    lexer.skipWhite()
    while (lexer.is('<')) {
      if (lexer.is('<!--')) {
        new Comment(lexer)
      } else if (lexer.is('<')) {
        this.content.push(new Element(lexer))
      } else {
        lexer.mlwithout('<', lexeme => { this.content = lexeme.trim() })
      }
      this.skipWhite()
    }

    lexer.token('</')
    lexer.skipWhite()
    lexer.token('name', lexeme => {
      if (this.elName !== lexeme) lexer.error('tagname mismatched')
    })
    lexer.skipWhite()
    lexer.token('>')
  }

  toString() {

  }

  toJSON = makeToJSON('elName', 'attrs', 'content')
}

export class Attrs {
  constructor(attrs) {
    this.name = 'attrs'
    if (attrs.name === 'lexer') {
      this.parse(attrs)
    } else if (typeof attrs === 'string') {
      this.parse(new Lexer(attrs))
    } else {
      this.value = attrs
    }
  }

  parse(lexer) {
    this.value = {}
    let name
    while (lexer.is('name')) {
      lexer.token('name', lexeme => { name = lexeme })
      lexer.skipWhite()
      lexer.token('=')
      lexer.skipWhite()
      lexer.token('"')
      lexer.without('"', lexeme => { this.value[name] = lexeme })
      lexer.token('"')
      lexer.skipWhite()
    }
  }

  toString() {
    const strs = []
    for (let name in this.value) strs.push(`${name}="${this.value[name]}"`)
    return strs.join(' ')
  }

  toJSON = makeToJSON('value')
}

export class Comment {
  constructor(comment) {
    this.name = 'comment'
    if (comment.name === 'lexer') {
      this.parse(comment)
    } else if (typeof comment === 'string') {
      this.parse(new Lexer(comment))
    } else {
      this.value = comment.value
    }
  }

  parse(lexer) {
    lexer.token('<!--')
    lexer.mlwithout('-->', lexeme => { this.value = lexeme })
    lexer.token('-->')
    lexer.skipWhite()
  }

  toString() { return `<!--${this.value}-->` }
  toJSON = makeToJSON('value')
}
