import AbstractLayout from './AbstractLayout'
import MeasureLayout from './MeasureLayout'

export default class SystemLayout extends AbstractLayout {
  constructor(measures, style) {
    super()
    this.name = 'system-layout'
    this.measures = measures
    this.style = style

    this.width = 300    // temp.
    this.height = 30    // tmep.

    this.measuresLayouts =
          measures.map(measure => new MeasureLayout(measure, style))
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
