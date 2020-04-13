import Document from '../utils/XmlDocument'
import { lastItem, arrayToSet } from '../utils/helpers'
import Score from './Score'

const STEP_CONVERT = { C: 1, D: 2, E: 3, F: 4, G: 5, A: 6, B: 7 }
const ALTER_TO_ACCIDENTAL = {
  '-2': 'bb', '-1': 'b', '0': 'n', '1': '#', '2': '##'
}
const VALID_TYPES = arrayToSet([1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024])
const DUR_TYPE_CONVERT = {
  maxima: 0.125, long: 0.25, breve: 0.5, whole: 1, half: 2, quarter: 4,
  eighth: 8, '16th': 16, '32nd': 32, '64th': 64, '128th': 128, '256th': 256,
  '512th': 512, '1024th': 1024
}

let divisions

export default function fromMxl(src) {
  const doc = new Document(src)
  const score = { head: { name: 'head' }, body: { name: 'body' } }
  const { head, body } = score
  let partIndex = 0

  doc.root.actContent({
    'movement-title': el => { head.title = el.content },
    identification: el => el.actContent({
      creator: cel => { head[cel.getAttr('type')] = cel.content }
    }),
    credit: el => guessTitleCreator(el, head),
    'part-list': el => { body.parts = makePartHead(el) },
    part: el => {
      makePart(el, body.parts[partIndex])
      partIndex++
    }
  })
  console.log(score)
  // return score
  return new Score(score)
}

const guessTitleCreator = (el, head) => {
  el.actContent({
    'credit-words': cel => {
      switch (cel.getAttr('justify')) {
        case 'center': head.title = head.title || cel.content; break
        case 'right': head.composer = head.composer || cel.content; break
        case 'left': head.lyricist = head.lyricist || cel.content; break
      }
    }
  })
}

const makePartHead = el => {
  const parts = []
  el.actContent({
    'score-part': cel => {
      const part = { name: 'part', head: { name: 'part-head' } }
      cel.actContent({
        'part-name': gcel => { part.head.partName = gcel.content },
        'part-abbreviation': gcel => { part.head.abbreviation = gcel.content },
        'midi-instrument': gcel => {
          const midi = part.head.midi = {}
          gcel.actContent({
            'midi-channel': ggcel => { midi.channel = +ggcel.content },
            'midi-program': ggcel => { midi.program = +ggcel.content },
            volume: ggcel => { midi.volume = +ggcel.content },
            pan: ggcel => { midi.pan = +ggcel.content }
          })
        }
      })
      parts.push(part)
    }
  })
  return parts
}

const makePart = (el, part) => {
  const makeStaff = () => ({ name: 'staff', cells: [] })
  const makeCell = () => ({ name: 'cell', data: [] })
  const makeStaves = num => {
    const result = []
    for (let i = 0; i < num; i++) result.push(makeStaff())
    return result
  }
  const addMeasureCells = () => part.staves.forEach(staff => staff.cells.push(makeCell()))
  const getMeasureCells = () => part.staves.map(staff => lastItem(staff.cells))

  let attrs
  part.staves = [makeStaff()]
  let prevPlacement

  el.actContent({
    measure: cel => {
      addMeasureCells()
      let measureCells = getMeasureCells()
      let prevStaffIndex

      cel.actContent({
        attributes: gcel => {
          attrs = makeAttributes(gcel)
          if (attrs.divisions) divisions = attrs.divisions
          if (attrs.staves > 1) {
            part.staves = makeStaves(attrs.staves)
            addMeasureCells()
            measureCells = getMeasureCells()
          }
          if (attrs.clefs) measureCells.forEach((cell, i) => cell.data.push(attrs.clefs[i]))
          if (attrs.key) measureCells.forEach(cell => cell.data.push(attrs.key))
          if (attrs.time) measureCells.forEach(cell => cell.data.push(attrs.time))
        },
        direction: gcel => {
          let placement = gcel.getAttr('placement')
          if (placement) {
            prevPlacement = placement
          } else {
            placement = prevPlacement
          }
          const makeDirection = dt => Object.assign({
            name: 'direction', placement },
          dt)
          gcel.actContent({
            'direction-type': ggcel => ggcel.actContent({
              words: gggcel => {
                measureCells[0].data.push(makeDirection({ words: gggcel.content }))
              },
              wedge: gggcel => {
                measureCells[0].data.push(makeDirection({ wedge: gggcel.getAttr('type') }))
              },
              dynamics: gggcel => {
                measureCells[0].data.push(makeDirection({ dynamics: gggcel.content[0].elName }))
              }
            })
          })
        },
        note: gcel => {
          const note = makeNote(gcel)
          const cell = measureCells[note.staff]
          if (note.chord && note.staff === prevStaffIndex && cell.data.length) {
            mergeChord(lastItem(cell.data), note)
          } else {
            cell.data.push(note)
          }
          prevStaffIndex = note.staff
          delete note.staff
        },
        barline: gcel => measureCells.forEach(cell => cell.data.push(makeBar(gcel)))
      })
      measureCells.forEach(cell => {
        setCellAccidentals(cell)
        const ldata = lastItem(cell.data)
        if (!ldata || ldata.name !== 'bar') cell.data.push({ name: 'bar', value: '|' })
      })
    }
  })
  return part
}

const makeBar = el => {
  const bar = { name: 'bar', value: '|' }
  el.actContent({
    'bar-style': cel => {
      switch (cel.content) {
        case 'light-heavy': bar.value = '|]'; return
        case 'light-light':  bar.value = '||'; return
      }
    },
    repeat: cel => {
      switch (cel.getAttr('direction')) {
        case 'forward': bar.value = '|:'; return
        case 'backward': bar.value = ':|'; return
      }
    }
  })
  return bar
}

const setCellAccidentals = cell => {
  const setPitch = pitch => {
    if ('alter' in pitch && pitch.alter !== currAlters[pitch.step]) {
      pitch.accidental = ALTER_TO_ACCIDENTAL[pitch.alter]
      currAltersUpdater[pitch.step] = pitch.alter
    }
  }
  const currAlters = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 }
  let currAltersUpdater

  cell.data.forEach(dt => {
    currAltersUpdater = {}
    switch (dt.name) {
      case 'note':
        setPitch(dt.pitch)
        break
      case 'chord':
        dt.pitches.forEach(setPitch)
        break
      case 'multipart':
        break
    }
    Object.assign(currAlters, currAltersUpdater)
  })
}

const makeAttributes = el => {
  const result = {}
  el.actContent({
    divisions: cel => { result.divisions = +cel.content },
    clef: cel => { result.clefs = result.clefs || []; result.clefs.push(makeClef(cel)) },
    key: cel => { result.key = makeKey(cel) },
    time: cel => { result.time = makeTime(cel) },
    staves: cel => { result.staves = +cel.content }
  })
  return result
}

const makeClef = el => {
  const result = { name: 'clef' }
  el.actContent({
    sign: cel => { result.sign = cel.content },
    line: cel => { result.line = +cel.content }
  })
  return result
}

const makeKey = el => {
  const result = { name: 'key' }
  el.actContent({
    fifths: cel => { result.fifths = +cel.content },
    mode: cel => { result.mode= cel.content }
  })
  return result
}

const makeTime = el => {
  const result = { name: 'time' }
  el.actContent({
    beats: cel => { result.beats = +cel.content },
    'beat-type': cel => { result.beatType = +cel.content }
  })
  return result
}

const makeNote = el => {
  const note = { name: 'note', duration: { name: 'duration', dot: 0 }, staff: 0 }
  const duration = note.duration
  el.actContent({
    rest: () => { note.name = 'rest' },
    chord: () => { note.chord = true },
    pitch: cel => { note.pitch = makePitch(cel) },
    duration: cel => Object.assign(duration, divisionToDuration(cel)),
    type: cel => { if (!duration.type) duration.type = DUR_TYPE_CONVERT[cel.content] },
    'time-modification': cel => { duration.modification = makeTimeModification(cel) },
    notations: cel => cel.actContent({
      articulations: gcel => { note.articulations = makeArticulations(gcel) },
      slur: gcel => {
        note.slurs = note.slurs || []
        note.slurs.push({ type: gcel.getAttr('type') })
      },
      tuplet: gcel => note.tuplet = { type: gcel.getAttr('type') }
    }),
    tie: cel => { if (cel.getAttr('type') === 'start') note.duration.tie = true },
    lyric: cel => { note.lyric = makeLyric(cel) },
    staff: cel => { note.staff = cel.content - 1 }
  })
  return note
}

const makeArticulations = el => {
  const result = []
  el.actContent({
    staccato: cel => result.push(cel.elName)
  })
  return result
}

const makeLyric = el => {
  const lyric = {}
  el.actContent({
    syllabic: cel => lyric.syllabic = cel.content,
    text: cel => lyric.text = cel.content
  })
  return lyric
}

const makeTimeModification = el => {
  const mod = {}
  el.actContent({
    'actual-notes': cel => { mod.actual = +cel.content },
    'normal-notes': cel => { mod.normal = +cel.content }
  })
  return mod
}

const divisionToDuration = el => {
  const quarters = +el.content / divisions
  let type = 4 / quarters
  if (VALID_TYPES[type]) return { type }
  type = type * 1.5
  if (VALID_TYPES[type]) return { type, dot: 1 }
  type = type * 1.75
  if (VALID_TYPES[type]) return { type, dot: 2 }
}

const mergeChord = (base, note) => {
  if (base.name === 'note') {
    base.name = 'chord'
    base.pitches = [base.pitch]
    delete base.pitch
  }
  base.pitches.push(note.pitch)
}

const makePitch = el => {
  const pitch = { name: 'pitch', accidental: '' }
  el.actContent({
    step: el => { pitch.step = STEP_CONVERT[el.content] },
    alter: el => { pitch.alter = +el.content },
    octave: el => { pitch.octave = el.content - 4 }
  })
  return pitch
}
