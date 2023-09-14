import { min, max, lastItem, zeros, forEachRight } from '../utils/helpers'

class Stick {
  constructor(main = null) {
    this.dirsAbove = []
    this.main = main  // Note {} | Rest {} | Chord {} | Time {} | Multipart
    this.dirsBelow = []
    this.lyrics = []
    // this.layers  // for multipart
    // this.tcQ
  }
}

class Bunch {
  constructor(sticks, tcQ, style) {
    this.sticks = sticks
    this.tcQ = tcQ
    this.style = style
  }

  setDx(dxName = 'dx') {
    let dx = 0

    this.sticks.forEach(stick => {
      if (!stick) return

      const { main, dirsAbove, dirsBelow, lyrics } = stick

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

    this[dxName] = dx
  }

  setDx2() {
    this.setDx('dx2')
  }

  setX(currXs, prevBunch) {
    const { style } = this
    const { dataSep } = style.cell
    const { lyricsHSep } =  style.note
    // console.log('prevBunch', prevBunch)
    let x = prevBunch.x + style.stepFont.width / 2 + dataSep / 2

    this.sticks.forEach((stick, s) => {
      if (!stick) return

      const cellCurrXs = currXs.sticks[s]
      const { main, dirsAbove, dirsBelow, lyrics } = stick

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

    this.x = x
    this.minX = x
  }
}


export default class BunchesArranger {
  constructor(cellsLayouts, style) {
    this.style = style

    const sticksForCells = cellsLayouts.map(this.makeSticks.bind(this))  // (first pass)
    const sticksForLayers = this.flatternSticks(sticksForCells)  // (second pass)

    this.bunches = this.makeBunches(sticksForLayers)  // (third pass)

    this.alignBunches()
    this.setXDataForSticks()
  }

  /*
    | 3/4 5 6 7 |
    --
    | 3/4 <<1 2- | 3-.>> |

    (First Pass)

    cellLayout => [
      [
        { main: '3/4', c: 0 },
        { main: '5', c: 0 },
        { main: '6', c: 0 },
        { main: '7', c: 0 }
      ],
      [
        { main: '3/4', c: 1 },
        { 
          main: Multipart {},
          layers: [
            [
              { main: '1', c: 1, mp: 0, l: 0 },
              { main: '2-', c: 1, mp: 0, l: 0 }
            ],
            [
              { main: '3-.', c: 1, mp: 0, l: 1 }
            ]
          ]
        }
      ]
    ]
  */
  // @param layout  cellLayout | layerLayout
  makeSticks(layout) {
    let sticks = []
    let currStick = new Stick()

    layout.dataLayout.layouts.forEach(dtLayout => {
      const { note, rest, chord, time, direction, multipart } = dtLayout
      const main = note || rest || chord || time || multipart

      if (main) {
        currStick.tcQ = main.tcQ
        currStick.main = dtLayout

        if (main.lyrics) {
          currStick.lyrics = dtLayout.lyricsLayouts
        } else if (multipart) {
          currStick.layers = dtLayout.layersLayouts.map(this.makeSticks)
        }

        sticks.push(currStick)
        currStick = new Stick()

      } else if (direction) {
        currStick.tcQ = direction.tcQ

        if (direction.placement === 'above') {
          currStick.dirsAbove.push(dtLayout)
        } else {
          currStick.dirsBelow.push(dtLayout)
        }

      } else {
        throw new TypeError('Unknown music data ayout: ' + dtLayout.name)
      }
    })

    sticks.forEach(stick => { layout.sticks.push(stick) })
    return sticks    
  }

  /*
    (Second Pass)

    // e.g., 2 cells => 3 layers
    =>
    [
      [
        { main: '3/4', c: 0 },
        { main: '5', c: 0 },
        { main: '6', c: 0 },
        { main: '7', c: 0 }
      ],
      [
        { main: '3/4', c: 1 },
        { main: '1', c: 1, mp: 0, l: 0 },
        { main: '2-', c: 1, mp: 0, l: 0 }
      ],
      [
        { main: '3-.', c: 1, mp: 0, l: 1 }
      ]
    ]
  */
  flatternSticks(sticksForCells) {
    let sticksForLayers = []

    sticksForCells.forEach(cellSticks => {
      const numLayers = max(cellSticks.map(stick => stick.layers ? stick.layers.length : 1).concat(0))
      const layersSticks = new Array(numLayers).fill([])

      cellSticks.forEach(stick => {
        if (stick.layers) {
          stick.layers.forEach((layerSticks, l) => {
            layersSticks[l] = layersSticks[l].concat(layerSticks)
          })
        } else {
          layersSticks[0].push(stick)
        }
      })

      sticksForLayers = sticksForLayers.concat(layersSticks)
    })

    return sticksForLayers
  }

  /*
    (Third Pass)

    this.bunches = [
      {
        // A bunch of sticks
        bunch: [
          { main: '3/4', c: 0 },  // this is a stick.
          { main: '3/4', c: 1 }   // the indices, c, mp and l, is to put the stick
        ],                        // back in the given cell, multipart and layer.
        tcQ                       // !!!can the sticks be in place beforehand?
      },                          // yes! so, drop the indices.!!!
      {
        bunch: [
          { main: '5', c: 0 },
          { main: '1', c: 1, mp: 0, l: 0 },  // there can be many multiparts in a cell.
          { main: '3-.', c: 1, mp: 0 l: 1 }
        ],
        tcQ
      },
      {
        bunch: [
          { main: '6', c: 0 },
          { main: '2-', c: 1, l: 0 }
        ],
        tcQ
      },
      {
        bunch: [
          { main: '7' },
        ],
        tcQ
      }
    ]
  */
  makeBunches(sticksForLayers) {
    const bunches = []

    const hasStickLeft = () => {
      for (let i = 0; i < sticksForLayers.length; i++) {
        const layerSticks = sticksForLayers[i]

        if (layerSticks.length > 0) {
          return true
        }
      }

      return false
    }

    const peelOffBunch = () => {
      const firstSticksForLayers = sticksForLayers.map(sticks => sticks[0])
      const minTcQ = min(firstSticksForLayers.map(stick => stick ? stick.tcQ : Infinity))

      const sticks = firstSticksForLayers.map(stick => {
        return  stick && stick.tcQ === minTcQ ? stick : null
      })

      // Peel off
      sticksForLayers.forEach((layerSticks, c) => { 
        if (sticks[c]) {
          layerSticks.shift()
        }
      })

      return new Bunch(sticks, minTcQ, this.style)
    }

    while (hasStickLeft()) {
      bunches.push(peelOffBunch(sticksForLayers))
    }

    return bunches
  }

  // Calc min-width, x = 0 right after cell: padding-left
  alignBunches() {
    if (this.bunches.length === 0) {
      return
    }

    const firstBunch = this.bunches[0]
    const lastBunch = lastItem(this.bunches)

    firstBunch.setDx()
    firstBunch.x = firstBunch.minX = firstBunch.dx
    lastBunch.setDx2()

// Maybe...
    this.bunches.forEach(bunch => {
      bunch.setDx()
      bunch.setDx2()
    })
// End of maybe.

    const currXs = this.initCurrXs()

    this.bunches.forEach((bunch, b) => {
      if (b > 0) {
        bunch.setX(currXs, this.bunches[b - 1])
      }

      this.updateCurrXs(currXs, bunch)
    })
  }


  initCurrXs() {
    const currXs = { sticks: [] }

    const updateArr = (currXsCell, stick, name) => {
      const { length } = stick[name]
      if (!length) return

      if (currXsCell[name]) {
        if (currXsCell[name].length < length) {
          currXsCell[name] = zeros(length)
        }
      } else {
        currXsCell[name] = zeros(length)
      }
    }

    this.bunches.forEach(bunch => {
      bunch.sticks.forEach((stick, s) => {
        if (!stick) return

        const currXsCell = currXs.sticks[s] = currXs.sticks[s] || { main: 0 }

        if (stick.dirsAbove) updateArr(currXsCell, stick, 'dirsAbove')
        if (stick.dirsBelow) updateArr(currXsCell, stick, 'dirsBelow')
        if (stick.lyrics) updateArr(currXsCell, stick, 'lyrics')
      })
    })

    // console.log('currXs', currXs)
    return currXs
  }

  updateCurrXs = (currXs, bunch) => {
    bunch.sticks.forEach((stick, s) => {
      if (!stick) return

      const cellCurrXs = currXs.sticks[s]
      const { main, dirsAbove, dirsBelow, lyrics } = stick

      if (main) {
        cellCurrXs.main = bunch.x + main.dx2
      }

      // if (dirsAbove) dx = max(dirsAbove.map(dir => dir[dxName]).concat(dx))
      // if (dirsBelow) dx = max(dirsBelow.map(dir => dir[dxName]).concat(dx))

      if (lyrics) {
        lyrics.forEach((lyric, l) => {
          cellCurrXs.lyrics[l] = bunch.x + lyric.dx2
        })
      }
    })
  }

  setXDataForSticks() {
    this.bunches.forEach(bunch => {
      bunch.sticks.forEach(stick => {
        if (!stick) return

        Object.assign(stick, bunch)
        delete stick.sticks
      })
    })
  }

  reflow(dataLayoutWidth) {
    const { bunches } = this
    if (bunches.length <= 1) return

    const { dx, minX: firstMinX } = bunches[0]
    const { dx2, minX: lastMinX } = lastItem(bunches)
    const oldRange = lastMinX - firstMinX
    const newRange = dataLayoutWidth - dx - dx2

    const spacingRatioReflow = () => {
      const ratio = newRange / oldRange
      // console.log(firstMinX, lastMinX, dx, dx2, oldRange, newRange, ratio)

      bunches.forEach(bunch => {
        bunch.x = ratio * (bunch.minX - dx) + dx
      })
    }

    const timingFavoredBackReflow = () => {
      const lastTcQ = lastItem(bunches).tcQ
      const blen = bunches.length

      const getTimingX = bunch => {
        const ratio = lastTcQ ? bunch.tcQ / lastTcQ : 1
        return newRange * ratio + dx
      }

      forEachRight(bunches, (bunch, i) => {
        if (i === blen - 1) { 
          bunch.x = getTimingX(bunch)
          return 
        }

        const nextBunch = bunches[i + 1]
        const timingX = getTimingX(bunch)
        const limDx = nextBunch.minX - bunch.minX
        const spaceLimitX = nextBunch.x - limDx

        // console.log(i, newRange, lastTcQ, dx, timingX, spaceLimitX, bunch, nextBunch)
        bunch.x = Math.min(timingX, spaceLimitX)
      })
    }

    const deoverflow = () => {
      bunches.forEach((bunch, b) => {
        if (bunch.tcQ === 0) { 
          bunch.x = bunch.minX
          return 
        }

        const prevStick = bunches[b - 1]
        const limDx = bunch.minX - prevStick.minX

        if (bunch.x - prevStick.x < limDx) {
          bunch.x = prevStick.x + limDx
        }
      })
    }

    // spacingRatioReflow()

    timingFavoredBackReflow()
    deoverflow()

    this.setXDataForSticks()
  }
}
