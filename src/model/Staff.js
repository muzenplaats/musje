import Lexer from './Lexer'
import { makeToJSON } from '../utils/helpers'
import { Q } from './constants'
import Cell from './Cell'
import Tie from './Tie'

const timeToDurQ = time => {
  const { beats, beatType } = time
  if (beatType === 8) return beats % 3 === 0 ? 1.5 * Q : 0.5 * Q
  return Q / beatType * 4
}

export default class Staff {
  constructor(staff) {
    this.name = 'staff'
    if (staff.name === 'lexer') {
      this.parse(staff)
    } else if (typeof staff === 'string') {
      this.parse(new Lexer(staff))
    } else {
      this.cells = staff.cells.map(cell => new Cell(cell))
    }
    this.resetLeftBars()
    this.setBeams()
    this.linkTies()
    this.linkSlurs()
    this.setT()
  }

  parse(lexer) {
    this.cells = []
    if (lexer.is('--')) {
      lexer.token('--')
      lexer.skipSS()
      if (!lexer.eol) lexer.error('Unexpected token')
    }
    lexer.skipWhite()
    while (lexer.is('cell')) {
      this.cells.push(new Cell(lexer))
      lexer.skipWhite()
    }
  }

  resetLeftBars() {
    const { cells } = this
    cells.forEach((cell, c) => {
      if (c > 0) cell.leftBar.value = cells[c - 1].rightBar.value
    })
  }

  setBeams() {
    this.makeBeamGroups().forEach(group => {
      group.forEach((dt, i) => {
        dt.duration.beams.forEach((beam, j) => {
          const prev = group[i - 1] && group[i - 1].duration.beams[j]
          const next = group[i + 1] && group[i + 1].duration.beams[j]
          if (prev && next) {
            beam.type = 'continue'
          } else if (prev) {
            beam.type = 'end'
          } else if (next) {
            beam.type = 'begin'
          }
        })
      })
      group.forEach((dt, i) => {
        dt.duration.beams.forEach((beam, j) => {
          if (beam.type !== 'begin') return
          for (let n = i + 1; n < group.length; n++) {
            let theBeam = group[n].duration.beams[j]
            if (theBeam && theBeam.type === 'end') beam.endBeam = theBeam
          }
        })
      })
    })
  }

  makeBeamGroups() {
    let gDurQ = 0
    const groups = []
    this.cells.forEach(cell => {
      const dumpGroup = () => {
        if (group.length) { groups.push(group); group = [] }
      }
      let currQ = 0
      let group = []
      cell.data.forEach(dt => {
        if (dt.name === 'time') {
          gDurQ = timeToDurQ(dt)
          currQ = 0
          dumpGroup()
          return
        }
        if (!gDurQ) return
        if (!dt.duration) return
        const { type, quartersQ } = dt.duration
        currQ += quartersQ
        if (type < 8) {
          dumpGroup()
          currQ %= gDurQ
        } else {
          if (currQ <= gDurQ) group.push(dt)
          if (currQ >= gDurQ) { currQ = 0; dumpGroup() }
        }
      })
      dumpGroup()
    })
    return groups
  }

  linkTies() {
    const getNextNote = (c, d) => {
      let ndt
      do {
        let ncell = this.cells[c]
        d++; ndt = ncell.data[d]
        if (!ndt) {
          c++; d = 0; ncell = this.cells[c]
          if (!ncell) break
          ndt = ncell.data[d]
        }
        if (ndt) {
          if (ndt.name === 'note') return { ndt, ncell }
          if (ndt.name === 'rest') break
        }
      } while (ndt)
      return {}
    }

    this.cells.forEach((cell, c) => {
      cell.data.forEach((dt, d) => {
        if (!dt.tie) return
        if (dt.name === 'chord') return   // TODO
        const { type } = dt.tie
        if (type === 'begin' || type === 'continue') {
          let { ndt, ncell } = getNextNote(c, d)
          if (ndt) {
            if (ndt.pitch.midiNumber !== dt.pitch.midiNumber) return
            ndt.tie = new Tie({
              type: ndt.tie ? 'continue' : 'end',
              cell: ncell
            })
            dt.tie.cell = cell
            dt.tie.nextNote = ndt
            dt.tie.next = ndt.tie
            ndt.tie.prevNote = dt
            ndt.tie.prev = dt.tie
          }
        }
      })
    })
  }

  linkSlurs() {
    const makeNextData = (c, d) => {
      return () => {
        let ncell, ndt
        while (!ndt) {
          ncell = this.cells[c]; d++; ndt = ncell.data[d]
          if (!ndt) {
            c++; d = 0; ncell = this.cells[c]
            if (!ncell) break
            ndt = ncell.data[d]
          }
        }
        return { ncell, ndt }
      }
    }

    this.cells.forEach((cell, c) => {
      cell.data.forEach((dt, d) => {
        if (!dt.beginSlurs) return
        const nextData = makeNextData(c, d)
        let { ncell, ndt } = nextData()
        while (ndt) {
          if (ndt.endSlurs) {
            dt.beginSlurs[0].cell = cell
            dt.beginSlurs[0].nextNote = ndt
            dt.beginSlurs[0].next = ndt.endSlurs[0]
            ndt.endSlurs[0].cell = ncell
            ndt.endSlurs[0].prevNote = dt
            ndt.endSlurs[0].prev = dt.beginSlurs[0]
            break
          }
          let n = nextData(); ndt = n.ndt; ncell = n.ncell
        }
      })
    })
  }

  setT() {
    const tempo = 60 / 150
    let t = 0, tQ = 0
    this.cells.forEach(cell => {
      cell.data.forEach(dt => {
        dt.t = t
        dt.tQ = tQ
        const { duration } = dt
        if (!duration) return
        const dur = duration.quarters * tempo
        duration.seconds = dur
        t += dur
        tQ += duration.quartersQ
      })
    })
  }

  toString() {
    const cellsStr = this.cells.join(' ')
    let lyrics = []
    this.cells.forEach(cell => {
      cell.data.forEach(dt => {
        if (dt.lyric) lyrics.push(dt.lyric)
      })
    })
    const lyricsStr = lyrics.join(' ')
    const strs = [cellsStr]
    if (lyricsStr) strs.push('lyrics: ' + lyricsStr)
    return strs.join('\n\n')
  }

  toJSON = makeToJSON('cells')
}
