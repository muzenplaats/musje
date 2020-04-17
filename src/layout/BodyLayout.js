import AbstractLayout from './AbstractLayout'
import SystemLayout from './SystemLayout'
import MeasureLayout from './MeasureLayout'
import { lastItem, sum } from '../utils/helpers'

export default class BodyLayout extends AbstractLayout {
  constructor(body, style) {
    super()
    this.name = 'body-layout'
    this.measures = body.measures
    this.style = style
    this.setWidth()
    this.makeSystemsLayouts()
    this.setHeight()
  }

  setWidth() {
    const { width, marginLeft, marginRight } = this.style.score
    this.width = width - marginLeft - marginRight
  }

  setHeight() {
    const { systemsLayouts } = this
    this.height = systemsLayouts.length ?
            (sum(systemsLayouts.map(layout => layout.height)) +
            (systemsLayouts.length - 1) * this.style.body.systemsSep) : 0
  }

  makeSystemsLayouts() {
    const { width } = this
    const minWidths = this.measures
          .map(measure => new MeasureLayout(measure, this.style))
          .map(measure => measure.minWidth)
    const lengths = []
    let currW = 0
    minWidths.forEach((minW, m) => {
      currW += minW
      if (currW === width) {
        lengths.push(m + 1)
        currW = 0
      } else if (currW > width) {
        lengths.push(m)
        currW = minW
      }
    })
    if (lastItem(lengths) !== minWidths.length) lengths.push(minWidths.length)
    for (let i = lengths.length - 1; i > 0; i--) {
      lengths[i] = lengths[i] - lengths[i - 1]
    }
    console.log(lengths)

    this.systemsLayouts = []
    let begin = 0, end
    lengths.forEach(len => {
      end = begin + len
      const measures = this.measures.slice(begin, end)
      const systemLayout = new SystemLayout(measures, this.style)
      systemLayout.width = this.width
      this.systemsLayouts.push(systemLayout)
      begin = end
    })
  }

  set position(pos) {
    super.position = pos
    const { systemsSep } = this.style.body
    let { x, y } = this
    this.systemsLayouts.forEach(layout => {
      layout.position = { x, y }
      y += layout.height + systemsSep
    })
  }

  toJSON() {
    const { systemsLayouts } = this
    return { ...super.toJSON(), systemsLayouts }
  }
}
