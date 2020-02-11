
export default function makeLexerClass(patterns) => {

  return class Lexer {
    constructor(src) {
      this.name = 'lexer'
      this.src = src
    }

    eat() {}

    token(tkn) {}
    optional(token) {}
    without(token) {}
    mlwithout(token) {}
    error(message) {}
  }
}
