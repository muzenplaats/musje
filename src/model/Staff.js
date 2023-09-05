import Lexer from './Lexer'
import { Q } from './constants'
import Cell from './Cell'
import Tie from './Tie'
import Lyrics from './Lyrics'
import Dummy from './Dummy'

/**
 * Staff := ('--' SS? NL)? WS? (Cell WS?)* Lyrics* 
 **/
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
    this.setMusicDataT()

    if (this.lyricsLines) {
      this.placeLyrics()
    }
  }

  parse(lexer) {
    this.cells = []

    if (lexer.is('--')) {
      lexer.token('--')
      lexer.skipSS()

      if (!lexer.eol) {
        lexer.error('Unexpected token in staff head')
      }
    }

    lexer.skipWhite()

    while (lexer.is('cell')) {
      this.cells.push(new Cell(lexer))
      lexer.skipWhite()
    }

    while (lexer.is('lyrics-head')) {
      this.lyricsLines = this.lyricsLines || []
      this.lyricsLines.push(new Lyrics(lexer))
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

            if (theBeam && theBeam.type === 'end') {
              beam.endBeam = theBeam
            }
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
        if (group.length) { 
          groups.push(group); group = [] 
        }
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
          if (ndt.name === 'note' || ndt.name === 'chord') {
            return { ndt, ncell }
          }

          if (ndt.name === 'rest') {
            break
          }
        }
      } while (ndt)

      return {}
    }

    this.cells.forEach((cell, c) => {
      cell.data.forEach((dt, d) => {
        if (!dt.tie) return

        const { type } = dt.tie
        if (type === 'begin' || type === 'continue') {
          let { ndt, ncell } = getNextNote(c, d)
          if (!ndt || !hasMatchedPitch(dt, ndt)) return

          const linkTiePair = (curr, next, dt, ndt) => {
            if (!curr || !next) return

            if (curr.tie) {
              if (curr.tie.type === 'end') curr.tie.type = 'continue'
            } else {
              curr.tie = new Tie({ type: 'begin' })
            }

            next.tie = new Tie({
              type: next.tie ? 'continue' : 'end', cell: ncell
            })

            curr.tie.cell = cell
            curr.tie.note = dt
            curr.tie.nextNote = ndt
            if (next.name === 'pitch') curr.tie.nextPitch = next
            curr.tie.next = next.tie
            next.tie.note = ndt
            next.tie.prevNote = dt
            if (curr.name === 'pitch') next.tie.prevPitch = curr
            next.tie.prev = curr.tie


            // chord~note
            if (curr.name === 'pitch' && next.name === 'note') {
              // console.log('chord~note', dt.tie)
              dt.tie.cell = cell
              dt.tie.note = dt
              dt.tie.nextNote = ndt
              dt.tie.next = ndt.tie

            // note~chord
            } else if (curr.name === 'note' && next.name === 'pitch') {
              // console.log('note~chord', ndt.tie)

              // Todo
              // dt.nextCT = ndt.tie
              // ndt.tie = new Tie({
              //   type: ndt.tie ? 'continue' : 'end', cell: ncell
              // })
              // ndt.tie.prevNote = dt
              // ndt.tie.prev = dt.tie
            }
          }

          switch (dt.name) {
            case 'note':
              switch (ndt.name) {
                case 'note':    // note~note
                  linkTiePair(dt, ndt, dt, ndt)
                  break
                case 'chord':   // note~chord
                  const npitch = getMatchedPitch(ndt.pitches, dt.pitch)
                  linkTiePair(dt, npitch, dt, ndt)
                  break
              }
              break
            case 'chord':
              switch (ndt.name) {
                case 'note':    // chord~note
                  const pitch = getMatchedPitch(dt.pitches, ndt.pitch)
                  linkTiePair(pitch, ndt, dt, ndt)
                  break
                case 'chord':   // chord-chord
                  const paires = getMatchedPitches(dt.pitches, ndt.pitches)
                  paires.forEach(({ curr, next }) =>
                                          linkTiePair(curr, next, dt, ndt))
                  linkTiePair(dt, ndt, dt, ndt)
                  break
              }
              break
          }
        }
      })
    })
  }

  linkSlurs() {
    this.cells.forEach((cell, c) => {
      cell.data.forEach((dt, d) => {
        if (!dt.beginSlurs) return

        const nextData = makeNextData(this.cells, c, d)
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

          let n = nextData()
          ndt = n.ndt
          ncell = n.ncell
        }
      })
    })
  }

  setMusicDataT() {
    const tempo = 60 / 90
    let t = 0
    let tQ = 0

    this.cells.forEach(cell => {
      let tc = 0
      let tcQ = 0

      cell.data.forEach(dt => {
        Object.assign(dt, { t, tQ, tc, tcQ })

        if (dt.name === 'multipart') {
          let max_tl = 0
          let max_tlQ = 0
          let tl
          let tlQ

          dt.layers.forEach(layer => {
            tl = 0
            tlQ = 0

            layer.data.forEach(ldt => {
              Object.assign(ldt, { 
                t: t + tl, 
                tQ: tQ + tlQ, 
                tc: tc + tl,
                tcQ: tcQ + tlQ 
              })

              const ldtDuration = ldt.duration

              if (!ldtDuration) {
                return
              }

              const ldur = ldtDuration.quarters * tempo

              ldtDuration.seconds = ldur
              tl += ldur
              tlQ += ldtDuration.quartersQ
            })

            max_tl = Math.max(max_tl, tl)
            max_tlQ = Math.max(max_tlQ, tlQ)
          })

          t += max_tl
          tQ += max_tlQ
          tc += max_tl
          tcQ += max_tlQ
        }

        const { duration } = dt

        if (!duration) {
          return
        }

        const dur = duration.quarters * tempo

        duration.seconds = dur
        t += dur
        tQ += duration.quartersQ
        tc += dur
        tcQ += duration.quartersQ
      })
    })
  }

  placeLyrics() {
    this.lyricsLines.forEach((lyrics, lineIndex) => {
      let inSlur = false
      let tmpOmitSlur = false

      for (let c = 0; c < this.cells.length; c++) {
        let cell = this.cells[c]

        for (let d = 0; d < cell.data.length; d++) {
          let dt = cell.data[d]
          if (!dt) break
          if (dt.tie && dt.tie.type !== 'begin') continue

          const headLyric = lyrics.list[0]

          if (headLyric && headLyric.name === 'lyric-control') {
            const control = lyrics.list.shift()
            const dummy = new Dummy({ lyrics: []})  // used for toString()
            dummy.lyrics[lineIndex] = control
            cell.data.splice(d, 0, dummy)
            const { instruction, type, amount } = control

            if (instruction === 'at') {
              if (type === 'measure') {
                c = amount - 2; break
              } else if (type === 'note') {
                d = amount - 1; continue
              }
            } else if (instruction === 'forward') {
              if (type === 'measure') {
                c += amount - 1; break
              } else if (type === 'note') {
                d += amount; continue
              }
            } else if (instruction === 'backward') {
              if (type === 'measure') {
                c -= amount + 1; break
              } else if (type === 'note') {
                d -= amount; tmpOmitSlur = true; continue
              }
            }
          }

          if ((!inSlur || tmpOmitSlur) &&
              (dt.name === 'note' || dt.name === 'chord')) {
            tmpOmitSlur = false
            const lyric = lyrics.list.shift()
            if (lyric) {
              dt.lyrics = dt.lyrics || []
              dt.lyrics[lineIndex] = lyric
            }
          }

          if (dt.endSlurs) inSlur = false
          if (dt.beginSlurs) inSlur = true
        }
      }
    })

    delete this.lyricsLines
  }

  toString() {
    const cellsStr = this.cells.join(' ')
    let lyricss = [[]]

    this.cells.forEach(cell => {
      cell.data.forEach(dt => {
        if (!dt.lyrics) return

        dt.lyrics.forEach((lyric, i) => {
          lyricss[i] = lyricss[i] || []
          lyricss[i].push(lyric)
        })
      })
    })

    const lyricsStrs = lyricss.map(lyrics => lyrics.join(' '))
    const strs = [cellsStr]
 
    lyricsStrs.forEach(lyricsStr => {
      if (lyricsStr) {
        strs.push('lyrics: ' + lyricsStr)
      }
    })
 
    return strs.join('\n\n')
  }

  toJSON() {
    const { cells } = this
    return { cells }
  }
}


const timeToDurQ = time => {
  const { beats, beatType } = time
  if (beatType === 8) {
    return beats % 3 === 0 ? 1.5 * Q : 0.5 * Q
  }

  return Q / beatType * 4
}

const makeNextData = (cells, c, d) => {
  return () => {
    let ncell, ndt

    while (!ndt) {
      ncell = cells[c]; d++; ndt = ncell.data[d]

      if (!ndt) {
        c++; d = 0; ncell = cells[c]
        if (!ncell) break
        ndt = ncell.data[d]
      }
    }

    return { ncell, ndt }
  }
}

const hasMatchedPitch = (dt, ndt) => {
  switch (dt.name) {
    case 'note':
      switch (ndt.name) {
        case 'note':
          return ndt.pitch.midiNumber === dt.pitch.midiNumber
        case 'chord':
          return ndt.pitches.some(pitch =>
                                  pitch.midiNumber === dt.pitch.midiNumber)
      }
    case 'chord':
      switch (ndt.name) {
        case 'note':
          return dt.pitches.some(pitch =>
                                 pitch.midiNumber === ndt.pitch.midiNumber)
        case 'chord':
          return dt.pitches.some((pitch, p) => {
            return ndt.pitches.some(npitch =>
                                      pitch.midiNumber === npitch.midiNumber)
          })
      }
  }
}

const getMatchedPitch = (pitches, pitch) => {
  for (let i = 0; i < pitches.length; i++) {
    if (pitches[i].midiNumber === pitch.midiNumber) return pitches[i]
  }
}

const getMatchedPitches = (pitches, npitches) => {
  const result = []

  pitches.forEach(pitch => {
    npitches.forEach(npitch => {
      if (pitch.midiNumber === npitch.midiNumber) {
        result.push({ curr: pitch, next: npitch })
      }
    })
  })

  return result
}
