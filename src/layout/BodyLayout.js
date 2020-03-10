import AbstractLayout from './AbstractLayout'
import SystemLayout from './SystemLayout'
import { lastItem, sum } from '../utils/helpers'

export default class BodyLayout extends AbstractLayout {
  constructor(body, style) {
    super()
    this.body = body
    this.style = style
    this.systemsLayout = new SystemsLayout(body.measures, style)
    this.width = this.systemsLayout.width
    this.height = this.systemsLayout.height
  }

  set position(pos) {
    super.position = pos
    this.systemsLayout.position = pos
  }
}

class SystemsLayout extends AbstractLayout {
  constructor(measures, style) {
    super()
    this.measures = measures
    this.style = style
    const { width, marginLeft, marginRight } = style.score
    this.width = width - marginLeft - marginRight
    this.makeLayouts()
    this.setHeight()
  }

  setHeight() {
    const { layouts } = this
    this.height = layouts.length ?
            (sum(layouts.map(layout => layout.height)) +
            (layouts.length - 1) * this.style.body.systemsSep) : 0
  }

  set position(pos) {
    super.position = pos
    const { systemsSep } = this.style.body
    let { x, y } = this
    this.layouts.forEach(layout => {
      layout.position = { x, y }
      y += layout.height + systemsSep
    })
  }

  makeLayouts() {
    const { width } = this
    const minWidths = this.measures.map(measure => measure.minWidth)
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
    const{log}=console;log(lengths)

    this.layouts = []
    let begin = 0, end
    lengths.forEach(len => {
      end = begin + len
      const measures = this.measures.slice(begin, end)
      this.layouts.push(new SystemLayout({ measures }, this.style))
      begin = end
    })
  }
}
