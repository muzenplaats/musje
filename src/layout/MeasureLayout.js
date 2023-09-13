import AbstractLayout from './AbstractLayout'
import CellLayout from './CellLayout'
import BarLayout from './BarLayout'
import Bar from '../model/Bar'
import { max, lastItem, range } from '../utils/helpers'
import BunchesArranger from './BunchesArranger'

export default class MeasureLayout extends AbstractLayout {
  constructor(measure, style) {
    super()
    this.name = 'measure-layout'

    this.measure = measure
    this.style = style
    this.cellsLayouts = measure.cells.map(cell => new CellLayout(cell, style))
    this.bunchesArranger = new BunchesArranger(this.cellsLayouts, style)

    this.cellsLayouts.forEach(layout => {
      layout.dataLayout.setMinWidth()
      layout.setMinWidth()
    })

    this.minWidth = max(this.cellsLayouts.map(layout => layout.minWidth))
    this.width = this.minWidth
  }

  // This will be called by SystemLayout
  setHeight(height, staves) {
    this.height = height
    this.staves = staves
  }

  reflow(width) {
    this.width = width

    this.cellsLayouts.forEach(cellLayout => { 
      cellLayout.reflow(width) 
    })

    const dataLayoutWidth = this.cellsLayouts[0].dataLayout.width
    this.bunchesArranger.reflow(dataLayoutWidth)
  }

  set position(pos) {
    super.position = pos

    const { x, x2, y } = this
    const { stavesSep } = this.style.system

    this.cellsLayouts.forEach((layout, c) => {
      if (this.atSysBegin) layout.addShownLeftBar()
      if (this.atSysEnd) layout.addShownRightBar()

      layout.position = { 
        x, 
        by: y + this.staves.by0s[c] 
      }
    })

    if (this.atSysBegin) {
      const lastCellIndex = this.cellsLayouts.length - 1
      if (!lastCellIndex) return

      this.connectBars('left', [[0, lastCellIndex]])
      if (!this.leftBarLayouts) return

      this.leftBarLayouts.forEach(layout => layout.position = {
        x, 
        y2: y + this.staves.by0s[layout.lastCellIndex]
      })

    } else if (this.atSysEnd) {
      this.connectBars('right', this.staves.partsToCellsIndices)
      if (!this.rightBarLayouts) return

      this.rightBarLayouts.forEach((layout, l) => {
        const cellIndex = this.staves.partsToCellsIndices[l]
        layout.position = {
          x2, 
          y2: y + this.staves.by0s[layout.lastCellIndex]
        }
      })
    }
  }

  connectBars(side, cellsIndicesList) {
    const getLeftBarLayout = cellLayout => {
      const { shownLeftBarLayout, leftBarLayout } = cellLayout
      return shownLeftBarLayout || leftBarLayout
    }

    const getRightBarLayout = cellLayout => {
      const { shownRightBarLayout, rightBarLayout } = cellLayout
      return shownRightBarLayout || rightBarLayout
    }

    const addMeasureBarLayout = (side, cs) => {
      if (cs[0] === cs[1]) return

      const barLineHeight = this.staves.by0s[cs[1]] - this.staves.by0s[cs[0]] +
                            this.style.bar.lineHeight

      if (side === 'left') {
        this.leftBarLayouts = this.leftBarLayouts || []
        const value = getLeftBarLayout(this.cellsLayouts[cs[0]]).bar.value
        const barLayout = new BarLayout(new Bar(value), this.style)

        barLayout.setHeight(barLineHeight)
        barLayout.displayDots = false
        barLayout.lastCellIndex = cs[1]
        this.leftBarLayouts.push(barLayout)

      } else if (side === 'right') {
        this.rightBarLayouts = this.rightBarLayouts || []
        const value = getRightBarLayout(this.cellsLayouts[cs[0]]).bar.value
        const barLayout = new BarLayout(new Bar(value), this.style)

        barLayout.setHeight(barLineHeight)
        barLayout.displayDots = false
        barLayout.lastCellIndex = cs[1]
        this.rightBarLayouts.push(barLayout)
      }
    }

    cellsIndicesList.forEach(cellsIndices => {
      if (cellsIndices.length < 2) return

      const cs = [cellsIndices[0], lastItem(cellsIndices)]
      addMeasureBarLayout(side, cs)

      range(cs[0], cs[1] + 1).forEach(c => {
        if (side === 'left') {
          const barLayout = getLeftBarLayout(this.cellsLayouts[c])
          barLayout.displayLines = false
        } else if (side === 'right') {
          const barLayout = getRightBarLayout(this.cellsLayouts[c])
          barLayout.displayLines = false
        }
      })
    })
  }

  toJSON() {
    const { cellsLayouts } = this
    return { ...super.toJSON(), cellsLayouts }
  }
}
