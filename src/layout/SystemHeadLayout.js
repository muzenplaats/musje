 import AbstractLayout from './AbstractLayout'

export default class SystemHeadLayout extends AbstractLayout {
  constructor(head, style) {
    super()
    this.name = 'system-head-layout'
    this.head = head
    this.style = style

    // Tmp
    this.width = this.head.nameType === 'full' ? 60 : 30
    this.height = 120
  }

  toJSON() {
    const { measuresLayouts } = this
    return { ...super.toJSON(), measuresLayouts }
  }
}
