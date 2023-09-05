import makeLexerClass from './makeLexerClass'
import { repeat, flatten } from './helpers'

const Lexer = makeLexerClass({
  '<': '<',
  '>': '>',
  '</': '<\\/',
  '/>': '\\/>',
  '=': '=',
  '"': '"',
  '<?xml': '<\\?xml',
  '?>': '\\?>',
  '<!Doctype': '<![Dd][Oo][Cc][Tt][Yy][Pp][Ee]',
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
      if (document.xmlDecl) this.xmlDecl = new XmlDecl(document.xmlDecl)
      if (document.doctype) this.doctype = new Doctype(document.doctype)
      this.root = new Element(document.root)
    }
  }

  parse(lexer) {
    lexer.skipWhite()
    if (lexer.is('<?xml')) this.xmlDecl = new XmlDecl(lexer)
    if (lexer.is('<!Doctype')) this.doctype = new Doctype(lexer)
    while (!lexer.eof) {
      if (lexer.is('<!--')) {
        new Comment(lexer)
      } else {
        this.root = new Element(lexer)
      }
    }
  }

  toString() {
    const strs = []
    if (this.xmlDecl) strs.push(this.xmlDecl)
    if (this.doctype) strs.push(this.doctype)
    strs.push(this.root)
    return strs.join('\n')
  }

  toJSON() {
    const { xmlDecl, doctype, root } = this
    return { xmlDecl, doctype, root }
  }
}

export class XmlDecl {
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
    lexer.token('<?xml')
    lexer.skipWhite()
    this.attrs = new Attrs(lexer)
    lexer.token('?>')
    lexer.skipWhite()
  }

  toString() { return `<?xml ${this.attrs}?>` }
  toJSON() {
    const { attrs } = this
    return { attrs }
  }
}

export class Doctype {
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
    lexer.token('<!Doctype')
    lexer.mlwithout('>', lexeme => { this.value = lexeme.trim() })
    lexer.token('>')
    lexer.skipWhite()
  }

  toString() { return `<!Doctype ${this.value}>` }
  toJSON() {
    const { value } = this
    return { value }
  }
}

export class Element {
  constructor(element, level = 0, indent = 2) {
    this.name = 'element'
    this.level = level
    this.indent = indent
    if (element.name === 'lexer') {
      this.parse(element)
    } else if (typeof element === 'string') {
      this.parse(new Lexer(element))
    } else {
      const { elName, attrs, content } = element
      this.elName = elName
      this.attrs = new Attrs(attrs)
      this.content = []
      if (Array.isArray(content)) {
        content.forEach(child => {
          this.content.push(new Element(child, level + 1, indent))
        })
      } else {
        this.content = content
      }
    }
  }

  parse(lexer) {
    this.content = []
    lexer.token('<')
    lexer.token('name', lexeme => { this.elName = lexeme })
    lexer.skipWhite()
    this.attrs = new Attrs(lexer)
    if (lexer.is('/>')) { lexer.token('/>'); return }
    lexer.token('>')

    lexer.skipWhite()
    while (!lexer.eof) {
      if (lexer.is('</')) {
        if (this.content.length === 0) this.content = ''
        break
      } else if (lexer.is('<!--')) {
        new Comment(lexer)
      } else if (lexer.is('<')) {
        this.content.push(new Element(lexer, this.level + 1, this.indent))
      } else {
        lexer.mlwithout('<', lexeme => { this.content = lexeme.trim() })
      }
      lexer.skipWhite()
    }

    lexer.token('</')
    lexer.skipWhite()
    lexer.token('name', lexeme => {
      if (this.elName !== lexeme) lexer.error('tagname mismatched')
    })
    lexer.skipWhite()
    lexer.token('>')
    lexer.skipWhite()
  }

  eachChild(cb) {
    const { content } = this
    if (!Array.isArray(content)) {
      return cb(content, 0)
    } else {
      content.forEach(cb)
    }
  }

  mapChild(cb) {
    const result = []
    this.eachChild((child, i) => result.push(cb(child, i)))
    return result
  }

  actContent(actions) {
    if (typeof this.content === 'undefined') return
    if (typeof this.content === 'string') return actions(this.content)
    this.content.forEach(child => {
      if (child.name !== 'element' || !actions[child.elName]) return
      actions[child.elName](child)
    })
  }

  get hasAttr() { return this.attrs.hasAttr }
  eachAttr(cb) { return this.attrs.each(cb) }
  mapAttr(cb) { return this.attrs.map(cb) }

  getAttr(name) { if (this.attrs) return this.attrs.getAttr(name) }
  actAttrs(actions) { if (this.attrs) this.attrs.act(actions) }

  toString() {
    const { level, indent, elName, attrs, content } = this
    const strs = []
    if (level > 0) strs.push('\n' + repeat(' ', level * indent))
    strs.push(`<${elName}`)
    if (attrs.hasAttr) strs.push(' ' + attrs)
    if (Array.isArray(content)) {
      if (content.length === 0) {
        strs.push('/>')
      } else {
        strs.push('>', content.join(''))
        strs.push('\n', repeat(' ', level * indent), `</${elName}>`)
      }
    } else {
      strs.push(`>${content}</${elName}>`)
    }
    return strs.join('')
  }

  toJSON() {
    const { elName, attrs, content } = this
    return { elName, attrs, content }
  }
}

export class Attrs {
  constructor(attrs = {}) {
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
    lexer.skipWhite()
  }

  get hasAttr() { return Object.keys(this.value).length > 0 }

  getAttr(name) { return this.value[name] }
  setAttr(name, values) { this.value[name] = value }

  act(actions) {
    for (let name in this.value) {
      if (actions[name]) actions[name](this.value[name])
    }
  }

  each(cb) {
    const { value } = this
    Object.keys(value).forEach((name, i) => cb(value[name], name, i))
  }

  map(cb) {
    const result = []
    this.each((val, name) => result.push(cb(val, name)))
    return result
  }

  toString() {
    const strs = []
    for (let name in this.value) strs.push(`${name}="${this.value[name]}"`)
    return strs.join(' ')
  }

  toJSON() {
    const { value } = this
    return { value }
  }
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
  toJSON() {
    const { value } = this
    return { value }
  }
}

export const el = (elName, attrs, content) => {
  if (Array.isArray(attrs) || typeof attrs !== 'object') {
    content = attrs
    attrs = {}
  }
  if (Array.isArray(content)) content = flatten(content)
  return { name: 'element', elName, attrs, content }
}
