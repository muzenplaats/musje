import Lexer from './Lexer'
import makeToJSON from '../utils/helpers'

export default Staff

class Staff {
  constructor(staff, style) {
    this.name = 'staff'
    this.style = style
    if (staff.name= 'lexer') {
      this.parse(staff)
    } else if (typeof staff === 'string') {
      this.parse(new Lexer(staff))
    } else {
      this.cells = staff.cells
    }
  }

  parse(lexer) {

  }

  toString() {}
  toJSON = makeToJSON('cells')
}
