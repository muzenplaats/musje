 import AbstractLayout from './AbstractLayout'
import MeasureLayout from './MeasureLayout'
import { zeros, sum } from '../utils/helpers'

export default class SystemLayout extends AbstractLayout {
  constructor(headLayout, measures, style) {
    super()
    this.name = 'system-layout'
    this.headLayout = headLayout
    this.measures = measures
    this.style = style

    const { length } = measures
    this.measuresLayouts = measures.map((measure, m) => {
      const layout = new MeasureLayout(measure, style)
      layout.atSysBegin = m === 0
      layout.atSysEnd = m === length - 1
      return layout
    })

    // this.width is set by BodyLayout
    this.setHeight()
  }

  setHeight() {
    if (!this.measuresLayouts.length) { this.height = 0; return }

    const arr0 = zeros(this.measuresLayouts[0].cellsLayouts.length)
    const { partIndices, partsToCellsIndices } = this.measuresLayouts[0].measure
    this.staves = {
      partIndices,
      partsToCellsIndices,
      heights: arr0,
      dys: arr0.slice(),
      dy2s: arr0.slice(),
      y0s: [],
      by0s: []
    }

    this.measuresLayouts.forEach(measureLayout => {
      measureLayout.cellsLayouts.forEach((cellLayout, c) => {
        this.staves.dys[c] = Math.max(this.staves.dys[c], cellLayout.dy)
        this.staves.dy2s[c] = Math.max(this.staves.dy2s[c], cellLayout.dy2)
        this.staves.heights[c] = this.staves.dys[c] + this.staves.dy2s[c]
      })
    })

    const { stavesSep } = this.style.system
    let y0 = 0
    this.staves.heights.forEach((height, s) => {
      this.staves.y0s.push(y0)
      this.staves.by0s.push(y0 + this.staves.dys[s])
      y0 += height + stavesSep
    })

    this.height = sum(this.staves.heights) +
                  this.style.system.stavesSep * (this.staves.heights.length - 1)

    this.headLayout.height = this.height
    this.headLayout.staves = this.staves
    this.measuresLayouts.forEach(measureLayout => {
      measureLayout.setHeight(this.height, this.staves)
    })
  }

  set position(pos) {
    super.position = pos
    let { x, y2 } = this
    this.headLayout.position = { x, y2 }
    x += this.headLayout.width
    this.measuresLayouts.forEach(layout => {
      layout.position = { x, y2 }
      x += layout.width
    })
  }

  toJSON() {
    const { headLayout, measuresLayouts } = this
    return { ...super.toJSON(), headLayout, measuresLayouts }
  }
}
