import Lexer from './Lexer'
import { makeToJSON, range } from '../utils/helpers'
import Part from './Part'
import Cell from './Cell'
import Measure from './Measure'

/**
 * Body := Part*
 * => Body {
 *   parts: Array[Part {}, Part {}, ...]
 * }
 **/
export default class Body {
  constructor(body = { parts: [] }) {
    this.name = 'body'
    if (body.name === 'lexer') {
      this.parse(body)
    } else if (typeof body === 'string') {
      this.parse(new Lexer (body))
    } else {
      if (!body.parts) body.parts = []
      this.parts = body.parts.map(part => new Part(part))
    }
    this.fillStaves()
    this.makeMeasures()
  }

  parse(lexer) {
    this.parts = []
    let part
    do {
      part = new Part(lexer)
      if (!part.isEmpty) this.parts.push(part)
    } while (lexer.is('part-head'))
  }

  eachStaff(cb) {
    this.parts.forEach((part, p) => {
      part.staves.forEach((staff, s) => cb(staff, s, p))
    })
  }

  mapStaff(cb) {
    const result = []
    this.eachStaff((staff, s, p) => result.push(cb(staff, s, p)))
    return result
  }

  fillStaves() {
    const maxLen = Math.max.apply(null,
                   this.mapStaff(staff => staff.cells.length))
    if (maxLen <= 0) return
    this.eachStaff(staff => {
      if (staff.cells.length === maxLen) return
      const m = maxLen - staff.cells.length
      staff.cells = staff.cells.concat(range(m).map(() => new Cell()))
    })
  }

  makeMeasures() {
    if (!this.parts.length) { this.measures = []; return }
    const m = this.parts[0].staves[0].cells.length
    const measures = range(m).map(() => ({ parts: [] }))
    this.eachStaff((staff, s, p) => {
      measures.forEach((measure, m) => {
        measure.parts[p] = measure.parts[p] || {}
        const mpart = measure.parts[p]
        mpart.staves = mpart.staves || []
        mpart.staves[s] = staff.cells[m]
      })
    })
    this.measures = measures.map(measure => new Measure(measure))
  }

  toString() {
    if (this.parts.length === 1) return this.parts[0].singlePartToString()
    return this.parts.join('\n\n')
  }

  toJSON = makeToJSON('parts', 'measures')
}
