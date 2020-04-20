import Lexer from './Lexer'
import { makeToJSON } from '../utils/helpers'
import { Q } from './constants'
import Cell from './Cell'

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
