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

export default class Style {
  constructor(src) {
    this.name = 'style'
    this.rawValue = {}
    this.parse(new Lexer(src))
    this.value = this.calcValue()
  }

  parse(lexer) {
    let names
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
      value = unit === '%' ? value / 100
                           : unit === '' ? value : value + unit
    }
    lexer.skipSS()
    if (!lexer.eof) lexer.nextLine()
    return { name, value }
  }

  calcValue() {
    const baseSize = +(/[\d.]+/.exec(this.rawValue.base.size)[0])
    const calc = val => {
      if (typeof val === 'string') {
        return /px$/.test(val) ? +val.slice(0, val.length - 2) : val
      }
      return val * baseSize
    }
    const raw = this.rawValue
    const result = {}
    for (let aname in raw) {
      result[aname] = {}
      let fontSize = raw[aname].size
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
}
