/* makeLexerClass.js v1.3.0-gamma */

const repeat = (rep, num) => new Array(num + 1).join(rep)
const { concat } = []
const flatten = arr => concat.apply([], arr)

class Lines {
  constructor(str, nlSpliter = 'both') {
    this.data = nlSpliter === 'both' ? str.replace(/\r\n/g, '\n').split('\n') :
                                       str.split(nlSpliter)
    this.ln = -1
    this.nextLine()
  }

  get eof() { return this.ln === this.data.length - 1 && this.line.eol }

  nextLine() {
    this.ln++
    this.line = new Line(this.data[this.ln])
  }
}

class Line {
  constructor(str, rest, col = 0) {
    this.str = str
    this.rest = rest || str
    this.col = col
  }

  get eol() { return this.rest.length === 0 }

  advance(num) {
    this.col += num
    this.rest = this.rest.substr(num)
  }

  cutoff(length) {
    this.cutoffRest = this.rest.substr(length)
    this.rest = this.rest.substr(0, length)
    this.isCutoff = true
  }
  joinCutoff() {
    this.rest += this.cutoffRest
    this.isCutoff = false
  }
}

// Data for sequencial token matching used in lexer.isSeq()
class SeqData {
  constructor(lexer) {
    this.lexer = lexer
    this.lines = lexer.lines
    this.setCurrLine(lexer.lines.ln)
    this.ref = 1
  }

  get eol() { return this.line.eol }
  get eof() {
    return this.ln === this.lines.data.length - 1 && this.line.eol
  }
  get hasNextLine() { return this.ln < this.lines.data.length - 1 }

  setCurrLine(ln) {
    this.ln = ln
    this.line = new Line(this.lines.data[ln])
  }

  nextLine() { this.setCurrLine(this.ln + 1) }

  // Some-of, change it but the result is false. The state has to be restored.
  keepState() {
    this.kstate = { ln: this.ln, line: { ...this.line } }
  }

  restoreState() {
    this.ln = this.kstate.ln
    const { str, rest, col } = this.kstate.line
    this.line = new Line(str, rest, col)
  }

  eatToTest(token) {
    if (token === 'NL') {
      if (this.eof || !this.line.eol) return false
      this.nextLine()
      return true
    }

    if (token === 'NL!') {
      if (this.hasNextLine) {
        this.nextLine()
        return true
      }
      return false
    }

    const pattern = this.lexer.getPattern(token)
    if (!(pattern instanceof RegExp)) return this.lexer.is(token)

    const matched = this.line.rest.match(pattern)
    if (!matched) return false
    this.line.advance(matched[0].length)
    return true
  }
}

const defaultPatterns = {
  S: ' ',
  SS: ' +',
  ALL: '.+'
}

const arrangeKeywords = patterns => {
  const { keywords } = patterns
  if (!keywords) return patterns
  patterns.keywords = `(${keywords})\\b`
  keywords.split('|').forEach(keyword => {
    patterns[keyword] = keyword + '\\b'
  })
  return patterns
}

// Array is for the seq or some-of type, and only use element 0.
const makeCompoundTokens = arr => {
  const tokensStr = arr[0]
  if (/^!/.test(tokensStr)) {
    if (/[ \|]/.test(tokensStr)) throw new Error('Not supported.')
    return { not: tokensStr.substr(1) }
  }
  if (/ /.test(tokensStr)) return { seq: tokensStr.split(' ') }
  if (/\|/.test(tokensStr)) return { some: tokensStr.split('|') }
  throw new Error('Incorrect compound tokens: ' + tokensStr)
}

const makePattern = str => {
  if (Array.isArray(str)) return makeCompoundTokens(str)
  if (/\|/.test(str)) str = `(${str})`   // fix a|b: x=> ^a|b o=> ^(a|b)
  return new RegExp('^' + str)
}

const makeEmbedData = (rawIdent, EmbedLexer) => {
  const ident = rawIdent.substring(2, rawIdent.length - 2)
  const result = {}
  result[ident] = new EmbedLexer()
  return result
}

const getPatterns = patterns => {
  patterns = { ...defaultPatterns, ...arrangeKeywords(patterns) }
  const result = [{}, {}, {}]
  for (let key in patterns) {
    const pattern = patterns[key]
    if (/^\{\{.+\}\}$/.test(key)) { result[0][key] = new pattern(); continue }
    result[0][key] = makePattern(pattern)
    result[1][key] = new RegExp(pattern)
    result[2][key] = new RegExp(pattern, 'g')
  }
  return result
}

const getNlSpliter = rawPattern => {
  if (!rawPattern) return 'both'    // win & unix
  const format = rawPattern.source.substr(1)  // turn-aboud
  if (/^win|^(CRLF|\\r\\n)$/i.test(format)) return '\r\n'
  if (/^(unix|LF|\\n)$/i.test(format)) return '\n'
  if (/^mac|^(CR|\\r)$/i.test(format)) return '\r'       // prior to os x
  throw new Error(`Invalid NL format: [${format}].`)
}

module.exports = function makeLexerClass(patterns) {
  const ptrns = getPatterns(patterns)
  return class Lexer {
    constructor(src = '') {
      this.name = 'lexer'
      this.src = src
      if (typeof src !== 'string') {
        throw new Error(`The type of src, ${typeof src}, is not string.`)
      }
      this.patterns = ptrns[0]
      this.aheadPatterns = ptrns[1]
      this.globalPatterns = ptrns[2]
      const nlSpliter = getNlSpliter(this.patterns['NL'])
      this.lines = new Lines(src, nlSpliter)
    }

    get line() { return this.lines.line }
    get ln() { return this.lines.ln }
    get col() { return this.line.col }
    get eol() { return this.line.eol }
    get eof() { return this.lines.eof }

    nextLine() { this.lines.nextLine() }

    getPattern(token) {
      if (token in this.patterns) return this.patterns[token]
      this.error(`Undefined token [${token}]`)
    }

    getAheadPattern(token) {
      if (token in this.aheadPatterns) return this.aheadPatterns[token]
      this.error(`Undefined token [${token}]`)
    }

    getGlobalPattern(token) {
      if (token in this.globalPatterns) return this.globalPatterns[token]
      this.error(`Undefined token [${token}]`)
    }

    eat(token) {
      const matched = this.line.rest.match(this.getPattern(token))
      if (!matched) this.error(`token [${token}]`)
      this.lexeme = matched[0]
      if (this.line.isCutoff) this.line.joinCutoff()
      this.line.advance(this.lexeme.length)
    }

    // Look ahead boundary tmp-cutoff.
    prevent(token) {
      const matched = this.line.rest.match(this.getAheadPattern(token))
      if (matched) this.line.cutoff(matched.index)
      return this
    }

    escprevent(token, escToken) {
      const matched = this.line.rest.matchAll(this.getGlobalPattern(token))
      if (!matched) return this
      const escMatched = this.line.rest.matchAll(this.getGlobalPattern(escToken))
      const escRanges = []
      let index

      const withinEsc = idx => {
        for (let i = 0; i < escRanges.length; i++) {
          const range = escRanges[i]
          if (idx >= range[0] && idx < range[1]) return true
        }
      }

      for (const match of escMatched) {
        escRanges.push([match.index, match.index + match[0].length])
      }
      for (const match of matched) {
        if (!withinEsc(match.index)) { index = match.index; break }
      }
      if (index >= 0) this.line.cutoff(index)
      return this
    }

    is(token) {
      const tokens = flatten(Array.from(arguments))
      if (tokens.length > 1) return this.isSeq(tokens)
      if (tokens.length === 1) token = tokens[0]
      if (token === 'NL') return this.eol && !this.eof

      const patternOrTokens = this.getPattern(token)
      const { not, seq, some } = patternOrTokens
      if (not) return !this.is(not)
      if (seq) return this.isSeq(seq)
      if (some) return this.isSome(some)
      if (this.seqData) return this.seqData.eatToTest(token)
      return patternOrTokens.test(this.line.rest)
    }

    isSeq(tokens) {
      if (this.seqData) {
        this.seqData.ref++
      } else {
        this.seqData = new SeqData(this)
      }

      const result = tokens.every(token => this.seqData.eatToTest(token))

      this.seqData.ref--
      if (!this.seqData.ref) delete this.seqData

      return result
    }

    isSome(tokens) {
      if (this.seqData) this.seqData.keepState()
      return tokens.some(token => {
        const result = this.is(token)
        if (this.seqData && !result) this.seqData.restoreState()
        return result
      })
    }

    token(tkn, act) {
      this.eat(tkn)
      if (act) act(this.lexeme)
    }

    optional(token, act) {
      this.lexeme = ''
      if (this.is(token)) {
        this.eat(token)
      } else {
        if (this.line.isCutoff) this.line.joinCutoff()
      }
      if (act) act(this.lexeme)
    }

    without(token, act) {
      this.prevent(token).optional('ALL', lexeme => act && act(lexeme))
    }

    escwithout(token, escToken, act) {
      this.escprevent(token, escToken)
          .optional('ALL', lexeme => act(lexeme))
    }

    mlwithout(token, act) {
      const pattern = this.getAheadPattern(token)
      const strs = []
      let matched = this.line.rest.match(pattern)

      while (!matched) {
        strs.push(this.line.rest)
        this.line.advance(this.line.rest.length)
        if (this.eof) break
        this.nextLine()
        matched = this.line.rest.match(pattern)
      }
      if (matched) {
        let without = this.line.rest.substr(0, matched.index)
        strs.push(without)
        this.line.advance(without.length)
      }
      this.lexeme = strs.join('\n')
      if (act) act(this.lexeme)
    }

    error(message) {
      const { ln } = this
      const messageLines = [
        `${message} at line ${this.ln + 1} column ${this.col + 1}.`
      ]
      if (ln > 1) messageLines.push('|' + this.lines.data[ln - 2])
      if (ln > 0) messageLines.push('|' + this.lines.data[ln - 1])
      messageLines.push('|' + this.lines.data[ln])
      messageLines.push(repeat(' ', this.line.col + 1) + '^')
      throw new Error(messageLines.join('\n'))
    }

    skipSS() { this.optional('SS') }

    skipWhite() {
      while ((this.is('S') || this.eol) && !this.eof) {
        if (this.eol) {
          this.nextLine()
        } else {
          this.token('SS')
        }
      }
    }

    optionalNL() { if (this.eol && !this.eof) this.nextLine() }

    to(lang) {
      const langLexer = this.patterns[`{{${lang}}}`]
      if (!langLexer) {
        throw new Error(`The embedded lexer {{${lang}}} not defined.`)
      }
      langLexer.lines = this.lines    // both share it
      return langLexer
    }
  }
}
