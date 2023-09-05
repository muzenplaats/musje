import Bar from'./Bar'
import { range } from '../utils/helpers'

export default class Measure {
  constructor(measure = { parts: [] }) {
    this.name = 'measure'

    this.parts = measure.parts
    this.cells = this.mapCell(cell => cell)
    this.partIndices = this.mapCell((cell, c, s, p) => p)
    this.setPartsToCellsIndices()
  }

  setPartsToCellsIndices() {
    this.partsToCellsIndices = range(this.parts.length).map(() => [])
    this.eachCell((cell, c, s, p) => this.partsToCellsIndices[p].push(c))
  }

  eachCell(cb) {
    let c = 0
    this.parts.forEach((part, p) => {
      part.staves.forEach((cell, s) => { cb(cell, c, s, p); c++ })
    })
  }

  mapCell(cb) {
    const result = []
    this.eachCell((cell, c, s, p) => result.push(cb(cell, c, s, p)))
    return result
  }

  toJSON() {
    const { parts, leftBar, rightBar } = this
    return { parts, leftBar, rightBar }
  }
}
