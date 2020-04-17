import Bar from'./Bar'
import { makeToJSON } from '../utils/helpers'

export default class Measure {
  constructor(measure = { parts: [] }) {
    this.name = 'measure'
    this.parts = measure.parts
    // this.setBars()
    this.cells = this.mapCell(c => c)
  }

  // setBars() {
  //   const c0 = this.cells[0]
  //   if (c0) {
  //     this.leftBar = new Bar(c0.leftBar.value)
  //     this.rightBar = new Bar(c0.rightBar.value)
  //   }
  // }

  eachCell(cb) {
    this.parts.forEach((part, p) => {
      part.staves.forEach((cell, s) => cb(cell, s, p))
    })
  }

  mapCell(cb) {
    const result = []
    this.eachCell((cell, s, p) => result.push(cb(cell, s, p)))
    return result
  }

  toJSON = makeToJSON('parts', 'leftBar', 'rightBar')
}
