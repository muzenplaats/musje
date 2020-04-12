import Bar from'./Bar'
import { lastItem, makeToJSON } from '../utils/helpers'

export default class Measure {
  constructor(measure = { parts: [] }) {
    this.name = 'measure'
    this.parts = measure.parts
    this.extractBars()
    this.cells = this.mapCell(c => c)
  }

  extractBars() {
    const makeBar = (value = '|') => new Bar(value)
    this.eachCell((cell, s, p) => {
      const { data } = cell
      if (p === 0 && s === 0) {
        if (data.length) {
          this.rightBar = lastItem(data).name === 'bar' ?
                         data.pop() : makeBar()
          this.leftBar = data.length === 0 || data[0].name !== 'bar' ?
                         makeBar() : data.shift()
        } else {
          this.leftBar = makeBar()
          this.rightBar = makeBar()
        }
      } else {
        if (data.length === 0) return
        if (lastItem(data).name === 'bar') data.pop()
        if (data.length > 0 && data[0].name === 'bar') {
          this.leftBar = data.shift()
        }
      }
      cell.leftBar = makeBar(this.leftBar.vaule)
      cell.rightBar = makeBar(this.rightBar.value)
    })
  }

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
