import AbstractLayout from './AbstractLayout'
import CellLayout from './CellLayout'
import { min, max, lastItem, zeros } from '../utils/helpers'

export default class MeasureLayout extends AbstractLayout {
  constructor(measure, style) {
    super()
    this.name = 'measure-layout'
    this.measure = measure
    this.style = style
    this.cellsLayouts = measure.cells.map(cell => new CellLayout(cell, style))
    this.makeSticks()
    this.alignSticks()
    this.setCellsSticks()
    this.cellsLayouts.forEach(layout => {
      layout.dataLayout.setMinWidth(); layout.setMinWidth()
    })
    this.minWidth = max(this.cellsLayouts.map(layout => layout.minWidth))
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
      layout.position = { x, by: y + staffDy }
      y += staffHeight + stavesSep
    })
  }

  // Prepare stics for aligning music data in time.
  makeSticks() {
    const cellsSticks = this.cellsLayouts
                            .map(cellLayout => makeCellSticks(cellLayout))
    this.sticks = []
    while (hasCellsSticks(cellsSticks)) {
      this.sticks.push(peelSticksWithSmallestTcQ(cellsSticks))
    }
    // console.log('Sticks for a MeasureLayout', this.sticks)
  }

  // Calc min-width, x = 0 right after cell: padding-left
  alignSticks() {
    if (!this.sticks.length) return
    const firstStick = this.sticks[0]
    setStickDx(firstStick)
    firstStick.x = firstStick.minX = firstStick.dx
    setStickDx2(lastItem(this.sticks))
    const currXs = initCurrXs(this.sticks)
    this.sticks.forEach((stick, s) => {
      if (s > 0) setStickX(currXs, stick, this.sticks[s - 1], this.style)
      updateCurrXs(currXs, stick)
    })
    // console.log('Sticks for a MeasureLayout', this.sticks)
  }

  setCellsSticks() {
    this.sticks.forEach(stick => {
      stick.cells.forEach((cell, c) => {
        const cellStick = Object.assign({}, cell, stick)
        delete cellStick.cells
        this.cellsLayouts[c].sticks.push(cellStick)
      })
    })
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
  const cells = firstAtCells.map(cstick =>
                               cstick && cstick.tcQ === minTcQ ? cstick : null)
  cellsSticks.forEach((sticks, i) => { if (cells[i]) sticks.shift() })
  return { cells, tcQ: minTcQ }
}

const setStickDx = (stick, dxName = 'dx') => {
  let dx = 0
  stick.cells.forEach(cell => {
    if (!cell) return
    const { main, dirsAbove, dirsBelow, lyrics } = cell
    if (main) dx = Math.max(dx, main[dxName])
    // if (dirsAbove) dx = max(dirsAbove.map(dir => dir[dxName]).concat(dx))
    // if (dirsBelow) dx = max(dirsBelow.map(dir => dir[dxName]).concat(dx))
    if (lyrics) dx = max(lyrics.map(dir => dir[dxName]).concat(dx))
  })
  stick[dxName] = dx
}

const setStickDx2 = stick => setStickDx(stick, 'dx2')

const initCurrXs = sticks => {
  const currXs = { cells: [] }
  const updateArr = (currXsCell, cell, name) => {
    const { length } = cell[name]
    if (!length) return
    if (currXsCell[name]) {
      if (currXsCell[name].length < length) currXsCell[name] = zeros(length)
    } else {
      currXsCell[name] = zeros(length)
    }
  }
  sticks.forEach(stick => {
    stick.cells.forEach((cell, c) => {
      if (!cell) return
      const currXsCell = currXs.cells[c] = currXs.cells[c] || { main: 0 }
      if (cell.dirsAbove) updateArr(currXsCell, cell, 'dirsAbove')
      if (cell.dirsBelow) updateArr(currXsCell, cell, 'dirsBelow')
      if (cell.lyrics) updateArr(currXsCell, cell, 'lyrics')
    })
  })
  // console.log('currXs', currXs)
  return currXs
}

const setStickX = (currXs, stick, prevStick, style) => {
  const { dataSep } = style.cell
  const { lyricsHSep } =  style.note
  // console.log('prevStick', prevStick)
  let x = prevStick.x + style.stepFont.width / 2 + dataSep / 2
  stick.cells.forEach((cell, c) => {
    if (!cell) return
    const cellCurrXs = currXs.cells[c]
    const { main, dirsAbove, dirsBelow, lyrics } = cell
    if (main) x = Math.max(x, cellCurrXs.main + dataSep + main.dx)
    // if (dirsAbove) dx = max(dirsAbove.map(dir => dir[dxName]).concat(dx))
    // if (dirsBelow) dx = max(dirsBelow.map(dir => dir[dxName]).concat(dx))
    if (lyrics) lyrics.forEach((lyric, l) => {
      x = Math.max(x, cellCurrXs.lyrics[l] + lyricsHSep + lyric.dx)
    })
  })
  stick.x = x
  stick.minX = x
}

const updateCurrXs = (currXs, stick) => {
  stick.cells.forEach((cell, c) => {
    if (!cell) return
    const cellCurrXs = currXs.cells[c]
    const { main, dirsAbove, dirsBelow, lyrics } = cell
    if (main) cellCurrXs.main = stick.x + main.dx2
    // if (dirsAbove) dx = max(dirsAbove.map(dir => dir[dxName]).concat(dx))
    // if (dirsBelow) dx = max(dirsBelow.map(dir => dir[dxName]).concat(dx))
    if (lyrics) lyrics.forEach((lyric, l) => {
      cellCurrXs.lyrics[l] = stick.x + lyric.dx2
    })
  })
}
