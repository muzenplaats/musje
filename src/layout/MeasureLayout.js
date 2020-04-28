import AbstractLayout from './AbstractLayout'
import CellLayout from './CellLayout'
import { min, max } from '../utils/helpers'

export default class MeasureLayout extends AbstractLayout {
  constructor(measure, style) {
    super()
    this.name = 'measure-layout'
    this.measure = measure
    this.style = style
    this.cellsLayouts = measure.cells.map(cell => new CellLayout(cell, style))
    this.minWidth = max(this.cellsLayouts.map(layout => layout.minWidth))
    this.makeSticks()
    this.width = this.minWidth
  }

  // SetHeight by SystemLayout
  setHeight(height, staves) {
    this.height = height
    this.staves = staves
  }

  set position(pos) {
    super.position = pos
    let { x, y } = this
    const { stavesSep } = this.style.system

    this.cellsLayouts.forEach((layout, c) => {
      if (this.atSysBegin) {
        layout.addShownLeftBar()
      } else if (this.atSysEnd) {
        layout.addShownRightBar()
      }
      const staffHeight = this.staves.heights[c]
      const staffDy = this.staves.dys[c]
      layout.position = { x, y2: y + staffDy }
      y += staffHeight + stavesSep
    })
  }

  // To line music data up in time.
  makeSticks() {
    const cellsSticks = this.cellsLayouts
                            .map(cellLayout => makeCellSticks(cellLayout))
    this.sticks = []
    while (hasCellsSticks(cellsSticks)) {
      this.sticks.push(peelSticksWithSmallestTcQ(cellsSticks))
    }
    console.log('Sticks for a MeasureLayout', this.sticks)
  }

  toJSON() {
    const { cellsLayouts } = this
    return { ...super.toJSON(), cellsLayouts }
  }
}

const makeEmptyStick = () => {
  return { dirsAbove: [], main: null, dirsBelow: [], lyrics: [] }
}
const makeCellSticks = cellLayout => {
  const sticks = []
  let currStick = makeEmptyStick()
  cellLayout.dataLayout.layouts.forEach(layout => {
    const { note, rest, chord, time, direction, multipart } = layout
    // const dt = note || rest || chord || direction || multipart || time
    const main = note || rest || chord || time
    if (main) {
      currStick.tcQ = main.tcQ
      currStick.main = layout
      if (main.lyrics) currStick.lyrics = layout.lyricsLayouts
      sticks.push(currStick)
      currStick = makeEmptyStick()
    } else if (direction) {
      currStick.tcQ = direction.tcQ
      if (direction.placement === 'above') {
        currStick.dirsAbove.push(layout)
      } else {
        currStick.dirsBelow.push(layout)
      }
    } else if (multipart) {
      // todo
    }
  })
  return sticks
}

const hasCellsSticks = cellsSticks => {
  for (let i = 0; i < cellsSticks.length; i++) {
    const cellSticks = cellsSticks[i]
    if (cellSticks.length) return true
  }
  return false
}

const peelSticksWithSmallestTcQ = cellsSticks => {
  const firstAtCells = cellsSticks.map(sticks => sticks[0])
  const minTcQ = min(firstAtCells.map(cstick => cstick ? cstick.tcQ : Infinity))
  const stick = firstAtCells.map(cstick =>
                               cstick && cstick.tcQ === minTcQ ? cstick : null)
  cellsSticks.forEach((sticks, i) => { if (stick[i]) sticks.shift() })
  return { stick, tcQ: minTcQ }
}
