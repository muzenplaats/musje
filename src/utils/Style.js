import makeLexerClass from '../utils/makeLexerClass'

const hyphenToCamel = name => {
  const fragments = name.split('-')
  const first = fragments.shift()
  return first + fragments.map(f => f[0].toUpperCase() + f.substr(1)).join('')
}

const Lexer = makeLexerClass({
  names: '[a-zA-Z\\d\\-, ]+',
  name: '[a-z\\-]+',
  string: '[a-zA-Z][a-zA-z\\d ]+',
  number: '[\\d\\.]+',
  unit: '(%|px)',
  '{': '{',
  ':': ':',
  '}': '}'
})

class UnitVal {
  constructor(value, unit, factors) {
    this.value = value
    this.unit = unit
    this.factors = factors
  }
  get pxValue() {
    if (this.unit === 'px') return this.value
    return this.value * this.factors.baseSize / 100
  }
}

export default class Style {
  constructor(src, factors = {}) {
    this.name = 'style'
    this.factors = factors
    this.rawValue = {}
    this.parse(new Lexer(src))
  }

  parse(lexer) {
    let names
    lexer.skipWhite()

    while (!lexer.eof) {
      lexer.token('names', lexeme => {
        names = lexeme.replace(/ +/g, '').split(',').map(hyphenToCamel)
      })
      names.forEach(aname => {
        this.rawValue[aname] = this.rawValue[aname] || {}
      })
      lexer.skipSS()
      lexer.token('{')
      lexer.nextLine()
      let nv
      do {
        nv = this.getNameValue(lexer)
        if (nv) {
          names.forEach(aname => { this.rawValue[aname][nv.name] = nv.value })
        }
      } while (nv)
      lexer.token('}')
      lexer.skipWhite()
    }
  }

  getNameValue(lexer) {
    let name, value, unit
    lexer.skipSS()
    if (!lexer.is('name')) return
    lexer.token('name', lexeme => { name = hyphenToCamel(lexeme) })
    lexer.skipSS()
    lexer.token(':')
    lexer.skipSS()

    if (lexer.is('string')) {
      lexer.token('string', lexeme => {
        value = lexeme.trim()
        if (/ /.test(value)) value = `"${value}"`
      })
    } else if (lexer.is('number')) {
      lexer.token('number', lexeme => { value = +lexeme })
      lexer.optional('unit', lexeme => { unit = lexeme })
      if (unit) value = new UnitVal(value, unit, this.factors)
    }
    lexer.skipSS()
    if (!lexer.eof) lexer.nextLine()
    return { name, value }
  }

  get value() {
    const raw = this.rawValue
    this.factors.baseSize = raw.base.size.pxValue

    const calc = val => val instanceof UnitVal ? val.pxValue : val
    const result = {}

    for (let aname in raw) {
      result[aname] = {}
      let fontSize = raw[aname].size
      if (fontSize) fontSize = fontSize.pxValue

      for (let name in raw[aname]) {
        switch (name) {
          case 'widthRatio':
            result[aname].width = calc(raw[aname][name] * fontSize)
            break
          case 'heightRatio':
            result[aname].height = calc(raw[aname][name] * fontSize)
            break
          case 'dxRatio':
            result[aname].dx = calc(raw[aname][name] * fontSize)
            break
          case 'dyRatio':
            result[aname].dy = calc(raw[aname][name] * fontSize)
            break
          default:
            result[aname][name] = calc(raw[aname][name])
        }
      }
    }
    return result
  }

  add(src) {
    const newRawValue = new Style(src, this.factors).rawValue
    Object.keys(newRawValue).forEach(name => {
      const value = newRawValue[name]
      Object.assign(this.rawValue[name], value)
    })
  }
}
