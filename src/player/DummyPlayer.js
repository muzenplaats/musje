// Error: file not found.

export default class DummyPlayer {
  construtor(dummy) {
    this.name = 'dummy-player'
    this.dummy = dummy
  }

  parse(lexer) {

  }

  toString() { return this.dummy }
  toJSON() {
    const { dummy } = this
    return { dummy }
  }
}
