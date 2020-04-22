import AbstractLayout from './AbstractLayout'
import MeasureLayout from './MeasureLayout'
import { range, sum } from '../utils/helpers'

export default class SystemLayout extends AbstractLayout {
  constructor(measures, style) {
    super()
    this.name = 'system-layout'
    this.measures = measures
    this.style = style

    const { length } = measures
    measures.forEach((measure, m) => {
      measure.atSysBegin = m === 0
      measure.atSysEnd = m === length - 1
    })

    this.measuresLayouts = measures.map(measure => {
      const layout = new MeasureLayout(measure, style)
      layout.atSysBegin = measure.atSysBegin
      layout.atSysEnd = measure.atSysEnd
      return layout
    })

    // this.width is set by BodyLayout
    this.setHeight()
  }

  setHeight() {
    if (!this.measuresLayouts.length) { this.height = 0; return }

    const arr0 = range(this.measuresLayouts[0].cellsLayouts.length).map(() => 0)
    this.staves = { heights: arr0, dys: arr0.slice(), dy2s: arr0.slice() }

    this.measuresLayouts.forEach(measureLayout => {
      measureLayout.cellsLayouts.forEach((cellLayout, c) => {
        this.staves.dys[c] = Math.max(this.staves.dys[c], cellLayout.dy)
        this.staves.dy2s[c] = Math.max(this.staves.dy2s[c], cellLayout.dy2)
        this.staves.heights[c] = this.staves.dys[c] + this.staves.dy2s[c]
      })
    })

    this.height = sum(this.staves.heights) +
                  this.style.system.stavesSep * (this.staves.heights.length - 1)

    this.measuresLayouts.forEach(measureLayout => {
      measureLayout.setHeight(this.height, this.staves)
    })
  }

  set position(pos) {
    super.position = pos
    let { x, y2 } = this
    this.measuresLayouts.forEach(layout => {
      layout.position = { x, y2 }
      x += layout.width
    })
  }

  toJSON() {
    const { measuresLayouts } = this
    return { ...super.toJSON(), measuresLayouts }
  }
}
