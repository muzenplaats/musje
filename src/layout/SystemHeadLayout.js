 import AbstractLayout from './AbstractLayout'
 import TextLayout from './TextLayout'
 import { max, lastItem } from '../utils/helpers'

export default class SystemHeadLayout extends AbstractLayout {
  constructor(head, style) {
    super()
    this.name = 'system-head-layout'
    this.head = head
    this.style = style
    this.partNamesLayouts = head.partHeads.map(partHead => {
      const text = head.nameType === 'full' ? partHead.partName :
                                              partHead.abbreviation
      return new TextLayout(text, style.partNameFont)
    })

    this.setWidth()
    // this.height and this.staves will be set by SystemLayout
  }

  setWidth() {
    const { partNamePaddingRight } = this.style.system
    this.width = max(this.partNamesLayouts.map(layout => layout.width))
    if (this.width) this.width += partNamePaddingRight
  }

  set position(pos) {
    super.position = pos
    let { x2, y } = this
    if (!this.staves) return

    const { stavesSep } = this.style.system
    const cellsYs = []

    this.staves.heights.forEach((height, s) => {
      const dy = this.staves.dys[s]
      const dy2 = this.staves.dy2s[s]
      cellsYs.push({ y, by: y + dy, y2: y + height })
      y += height + stavesSep
    })

    x2 -= this.style.system.partNamePaddingRight
    const { partsToCellsIndices } = this.staves
    const { lineHeight } = this.style.bar
    this.partNamesLayouts.forEach((layout, p) => {
      const cellIndices = partsToCellsIndices[p]
      const y1 = cellsYs[cellIndices[0]].by - lineHeight
      const y2 = cellsYs[lastItem(cellIndices)].by
      layout.position = { x2, cy: (y1 + y2) / 2 }
    })
  }

  toJSON() {
    const { partNamesLayouts } = this
    return { ...super.toJSON(), partNamesLayouts }
  }
}
