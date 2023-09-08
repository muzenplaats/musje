import AbstractLayout from './AbstractLayout'
import CellLayout from './CellLayout'
import BarLayout from './BarLayout'
import Bar from '../model/Bar'
import { min, max, lastItem, range, zeros, forEachRight } from '../utils/helpers'

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
      layout.dataLayout.setMinWidth()
      layout.setMinWidth()
    })

    this.minWidth = max(this.cellsLayouts.map(layout => layout.minWidth))
    this.width = this.minWidth
  }

  // SetHeight by SystemLayout
  setHeight(height, staves) {
    this.height = height
    this.staves = staves
  }

  reflow(width) {
    // console.log('reflow measure..')
     // width += 50

    this.width = width

    this.cellsLayouts.forEach(cellLayout => { 
      cellLayout.reflow(width) 
    })

    const dataLayoutWidth = this.cellsLayouts[0].dataLayout.width

    reflowSticks(this.sticks, dataLayoutWidth)

    this.setCellsSticks()
  }

  set position(pos) {
    super.position = pos

    const { x, x2, y } = this
    const { stavesSep } = this.style.system

    this.cellsLayouts.forEach((layout, c) => {
      if (this.atSysBegin) layout.addShownLeftBar()
      if (this.atSysEnd) layout.addShownRightBar()

      layout.position = { x, by: y + this.staves.by0s[c] }
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
      if (s > 0) {
        setStickX(currXs, stick, this.sticks[s - 1], this.style)
      }

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
  return { 
    dirsAbove: [], 
    main: null, 
    dirsBelow: [], 
    lyrics: [] 
  }
}

const makeCellSticks = cellLayout => {
  let sticks = []
  let currStick = makeEmptyStick()

  cellLayout.dataLayout.layouts.forEach(layout => {
    const { note, rest, chord, time, direction, multipart } = layout
    // const dt = note || rest || chord || direction || multipart || time
    const main = note || rest || chord || time

    if (main) {
      currStick.tcQ = main.tcQ
      currStick.main = layout

      if (main.lyrics) {
        currStick.lyrics = layout.lyricsLayouts
      }

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
      // Temp idea
      sticks = sticks.concat(makeCellSticks(layout.layersLayouts[0]))
      // sticks = sticks.concat(makeCellSticks(layout.layersLayouts[0]))
      currStick = makeEmptyStick()


      // layout.layersLayouts.forEach(layerLayout => {
      //   layerLayout.dataLayout.l        
      // })

      // layout.layersLayouts.forEach(makeCellSticks)  // layer is a subset of cell.
    }
  })

  return sticks
}

const hasCellsSticks = cellsSticks => {
  for (let i = 0; i < cellsSticks.length; i++) {
    const cellSticks = cellsSticks[i]

    if (cellSticks.length) {
      return true
    }
  }

  return false
}

const peelSticksWithSmallestTcQ = cellsSticks => {
  const firstAtCells = cellsSticks.map(sticks => sticks[0])
  const minTcQ = min(firstAtCells.map(cstick => cstick ? cstick.tcQ : Infinity))

  const cells = firstAtCells.map(cstick => {
    return  cstick && cstick.tcQ === minTcQ ? cstick : null
  })
                              
  cellsSticks.forEach((sticks, i) => { 
    if (cells[i]) {
      sticks.shift() 
    }
  })

  return { cells, tcQ: minTcQ }
}

const setStickDx = (stick, dxName = 'dx') => {
  let dx = 0

  stick.cells.forEach(cell => {
    if (!cell) return

    const { main, dirsAbove, dirsBelow, lyrics } = cell

    if (main) {
      dx = Math.max(dx, main[dxName])
    }

    // if (dirsAbove) dx = max(dirsAbove.map(dir => dir[dxName]).concat(dx))
    // if (dirsBelow) dx = max(dirsBelow.map(dir => dir[dxName]).concat(dx))

    if (lyrics) {
      dx = max(lyrics.map(lyric => lyric[dxName]).concat(dx)
             .filter(dx => dx !== undefined))
    }
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
      if (currXsCell[name].length < length) {
        currXsCell[name] = zeros(length)
      }
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

    if (main) {
      x = Math.max(x, cellCurrXs.main + dataSep + main.dx)
    }

    // if (dirsAbove) dx = max(dirsAbove.map(dir => dir[dxName]).concat(dx))
    // if (dirsBelow) dx = max(dirsBelow.map(dir => dir[dxName]).concat(dx))

    if (lyrics) {
      lyrics.forEach((lyric, l) => {
        x = Math.max(x, cellCurrXs.lyrics[l] + lyricsHSep + lyric.dx)
      })
    }
  })

  stick.x = x
  stick.minX = x
}

const updateCurrXs = (currXs, stick) => {
  stick.cells.forEach((cell, c) => {
    if (!cell) return

    const cellCurrXs = currXs.cells[c]
    const { main, dirsAbove, dirsBelow, lyrics } = cell

    if (main) {
      cellCurrXs.main = stick.x + main.dx2
    }

    // if (dirsAbove) dx = max(dirsAbove.map(dir => dir[dxName]).concat(dx))
    // if (dirsBelow) dx = max(dirsBelow.map(dir => dir[dxName]).concat(dx))

    if (lyrics) {
      lyrics.forEach((lyric, l) => {
        cellCurrXs.lyrics[l] = stick.x + lyric.dx2
      })
    }
  })
}

const reflowSticks = (sticks, dataLayoutWidth) => {
  if (sticks.length <= 1) return

  const { dx, minX: firstMinX } = sticks[0]
  const { dx2, minX: lastMinX } = lastItem(sticks)
  const oldRange = lastMinX - firstMinX
  const newRange = dataLayoutWidth - dx - dx2

  const spacingRatioReflow = () => {
    const ratio = newRange / oldRange
    // console.log(firstMinX, lastMinX, dx, dx2, oldRange, newRange, ratio)

    sticks.forEach(stick => {
      stick.x = ratio * (stick.minX - dx) + dx
    })
  }

  const timingFavoredBackReflow = () => {
    const lastTcQ = lastItem(sticks).tcQ
    const slen = sticks.length

    const getTimingX = stick => {
      const ratio = lastTcQ ? stick.tcQ / lastTcQ : 1
      return newRange * ratio + dx
    }

    forEachRight(sticks, (stick, i) => {
      if (i === slen - 1) { 
        stick.x = getTimingX(stick)
        return 
      }

      const nextStick = sticks[i + 1]
      const timingX = getTimingX(stick)
      const limDx = nextStick.minX - stick.minX
      const spaceLimitX = nextStick.x - limDx

      // console.log(i, newRange, lastTcQ, dx, timingX, spaceLimitX, stick, nextStick)
      stick.x = Math.min(timingX, spaceLimitX)
    })
  }

  const deoverflow = () => {
    sticks.forEach((stick, s) => {
      if (stick.tcQ === 0) { 
        stick.x = stick.minX
        return 
      }

      const prevStick = sticks[s - 1]
      const limDx = stick.minX - prevStick.minX

      if (stick.x - prevStick.x < limDx) {
        stick.x = prevStick.x + limDx
      }
    })
  }

  // spacingRatioReflow()

  timingFavoredBackReflow()
  deoverflow()
}
