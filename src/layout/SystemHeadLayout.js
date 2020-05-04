 import AbstractLayout from './AbstractLayout'
 import TextLayout from './TextLayout'
 import { max, lastItem } from '../utils/helpers'

export default class SystemHeadLayout extends AbstractLayout {
  constructor(head, style) {
    super()
    this.name = 'system-head-layout'
    this.head = head
    this.style = style
    this.setBracesLayouts()
    this.partNamesLayouts = head.partHeads.map(partHead => {
      const text = head.nameType === 'full' ? partHead.partName :
                                              partHead.abbreviation
      return new TextLayout(text, style.partNameFont)
    })

    this.setWidth()
    // this.height and this.staves will be set by SystemLayout
  }

  setBracesLayouts() {
    const { partHeads, partsToCellsIndices } = this.head
    if (!partsToCellsIndices) return

    partsToCellsIndices.forEach((cellsIndices, p) => {
      // Tmp
      const hasBrace = partHeads[p].partName === 'Piano' &&
                       cellsIndices.length >= 2
      if (!hasBrace) return

      this.bracesLayouts = this.bracesLayouts || []
      const layout = new BraceLayout(this.style)
      layout.cs = [cellsIndices[0], lastItem(cellsIndices)]
      this.bracesLayouts.push(layout)
    })
  }

  setWidth() {
    const { partNamePaddingRight } = this.style.system
    this.width = max(this.partNamesLayouts.map(layout => layout.width))
    if (this.width) this.width += partNamePaddingRight
    if (this.bracesLayouts) {
      const { bracePaddingRight, braceWidth } = this.style.systemHead
      this.width += bracePaddingRight + braceWidth
    }
  }

  setBracesHeight() {
    this.bracesLayouts.forEach(layout => {
      const { cs } = layout
      layout.height = this.staves.by0s[cs[1]] -
                      this.staves.by0s[cs[0]] +  this.style.bar.lineHeight
      layout.by0 = this.staves.by0s[cs[1]]
    })
  }

  set position(pos) {
    super.position = pos
    const { x2, y } = this
    if (!this.staves) return

    const cellsBys = this.staves.by0s.map((by0, s) => y + by0)
    let pnX2 = x2 - this.style.system.partNamePaddingRight
    if (this.bracesLayouts) {
      const { bracePaddingRight, braceWidth } = this.style.systemHead
      pnX2 -= bracePaddingRight + braceWidth
    }

    const { partsToCellsIndices } = this.staves
    const { lineHeight } = this.style.bar
    this.partNamesLayouts.forEach((layout, p) => {
      const cellsIndices = partsToCellsIndices[p]
      const y1 = cellsBys[cellsIndices[0]] - lineHeight
      const y2 = cellsBys[lastItem(cellsIndices)]
      layout.position = { x2: pnX2, cy: (y1 + y2) / 2 }
    })
    if (this.bracesLayouts) {
      this.setBracesHeight()
      this.bracesLayouts.forEach(layout => {
        layout.position = {
          x2: x2 - this.style.systemHead.bracePaddingRight,
          y2: y + layout.by0 }
      })
    }
  }

  toJSON() {
    const { partNamesLayouts, bracesLayouts } = this
    return { ...super.toJSON(), partNamesLayouts, bracesLayouts }
  }
}

class BraceLayout extends AbstractLayout {
  constructor(style) {
    super()
    this.style = style
    this.width = style.systemHead.braceWidth
    this.strokeWidth = style.systemHead.braceStrokeWidth
  }
}
