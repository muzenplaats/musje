import AbstractLayout from './AbstractLayout'
import MeasureLayout from './MeasureLayout'

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
    this.height = 30    // tmep.
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
