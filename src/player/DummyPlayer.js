import { makeToJSON } from 'toolbox/helpers'
// Error: file not found.

export default class DummyPlayer {
  construtor(dummy) {
    this.name = 'dummy-player'
    this.dummy = dummy
  }

  parse(lexer) {

  }

  toString() { return this.dummy }
  toJSON = makeToJSON('dummy')
}
