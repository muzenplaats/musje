import { repeat } from './helpers'

class Lines {
  constructor(str) {
    this.data = str.split('\n')
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
  constructor(str) {
    this.str = str
    this.rest = str
    this.col = 0
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

const defaultPatterns = {
  S: ' ',
  SS: ' +',
  ALL: '.+'
}

const getPatterns = patterns => {
  patterns = { ...defaultPatterns, ...patterns }
  const result = [{}, {}, {}]
  for (let key in patterns) {
    result[0][key] = new RegExp('^' + patterns[key])
    result[1][key] = new RegExp(patterns[key])
    result[2][key] = new RegExp(patterns[key], 'g')
  }
  return result
}

export default function makeLexerClass(patterns) {
  return class Lexer {
    constructor(src) {
      this.name = 'lexer'
      this.src = src.replace(/\r\n/g, '\n')
      this.lines = new Lines(this.src)
      const ptrns = getPatterns(patterns)
      this.patterns = ptrns[0]
      this.aheadPatterns = ptrns[1]
      this.globalPatterns = ptrns[2]
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
      return this.getPattern(token).test(this.line.rest)
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
      this.prevent(token).token('ALL', lexeme => act(lexeme))
    }

    escwithout(token, escToken, act) {
      this.escprevent(token, escToken).token('ALL', lexeme => act(lexeme))
    }

    // without(token, act) {
    //   const matched = this.line.rest.match(this.getAheadPattern(token))
    //   this.lexeme = matched ? this.line.rest.substr(0, matched.index) :
    //                           this.line.rest
    //   this.line.advance(this.lexeme.length)
    //   if (act) act(this.lexeme)
    // }

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
      throw new Error(`${message} at line ${this.ln + 1} column ${this.col + 1}.
${this.line.str}
${repeat(' ', this.line.col)}^`)
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
  }
}
