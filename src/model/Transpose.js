import { makeToJSON } from '../utils/helpers'
import Lexer from './Lexer'

/**
  ref:
  <!ELEMENT transpose
  (diatonic?, chromatic, octave-change?, double?)>
  <!ATTLIST transpose
      number CDATA #IMPLIED
      %optional-unique-id;
  >
**/

export default class Tranpose {
  constructor(tranpose) {
    this.name = 'tranpose'
    if (tranpose.name === 'lexer') {
      this.parse(tranpose)
    } else if (typeof tranpose === 'string') {
      this.parse(new Lexer(tranpose))
    } else {
      this.diatonic = tranpose.diatonic
      this.chromatic = tranpose.chromatic
      this.octaveChange = tranpose.octaveChange
      this.double = tranpose.double
    }
  }

  parse(lexer) {
    // Todo
  }

  toString() { return `` }
  toJSON = makeToJSON('diatonic', 'chromatic', 'octaveChange', 'double')
}
