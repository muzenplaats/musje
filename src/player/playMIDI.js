import MIDI from '../../lib/midi'
import { sum } from '../utils/helpers'

window.onload = () => {
  MIDI.loadPlugin({
    soundfontUrl: './soundfont/',
    instrument: 'acoustic_grand_piano',
    onprogress(state, progress) {
      console.log(state, progress)
    },
    onsuccess() {
      // var delay = 0  // play one note every quarter second
      // var note = 50  // the MIDI note
      // var velocity = 127  // how hard the note hits
      // // play the note
      // MIDI.setVolume(0, 127)
      // MIDI.noteOn(0, note, velocity, delay)
      // MIDI.noteOff(0, note, delay + 0.75)
    }
  })
}

const tos = []

export function play() {
  const obj = this.obj

  switch (obj.name) {
    case 'score': playScore(obj); break
    case 'part': playPart(obj); break
    case 'staff': playStaff(obj); break
    case 'cell': playCell(obj); break
    case 'note': playNote(obj); break
  }
}

export function pause() {}

export function stop() {
  tos.forEach(clearTimeout)
  tos.length = 0
}

const midiPlay = (t, midiNumber, dur, onended) => {
  const velocity = 127
  MIDI.setVolume(0, 127)
  MIDI.noteOn(0, midiNumber, velocity, t)
  MIDI.noteOff(0, midiNumber, t + dur)
  if (onended) {
    setTimeout(onended, (t + dur) * 1000)
  }
}

const getTiedNotes = note => {
  const notes = [note]
  let nnote = note.tie.nextNote
  while (nnote) {
    notes.push(nnote)
    if (nnote.tie) nnote = nnote.tie.nextNote
  }
  return notes
}

const getTiedDtPitchPairs = ({ dt, pitch }) => {
  const pairs = [{ dt, pitch }]

  const nextPair = () => {
    const { tie } = pitch || dt
    dt = tie.nextNote
    pitch = tie.nextPitch
  }

  nextPair()
  while (dt) {
    pairs.push({ dt, pitch })
    nextPair()
  }
  return pairs
}

const playTiedPairs = (pitch, pairs, context) => {
  pairs.forEach(({ dt, pitch }) => {
    if (pitch) pitch.onplay(); else dt.onplay()
  })
  const dur = sum(pairs.map(({ dt }) => getDur(dt)))
  const stopHandler = () => pairs.forEach(({ dt, pitch }) => {
    if (pitch) pitch.onstop(); else dt.onstop()
  })
  midiPlay(0, pitch.midiNumber, dur, stopHandler, context)
}

const chordOnplay = pairs => {
  pairs.forEach(({ dt }) => { if (dt.name === 'chord') dt.onplay() })
  const dur = sum(pairs.map(({ dt }) => getDur(dt)))
  setTimeout(() => {
    pairs.forEach(({ dt }) => { if (dt.name === 'chord') dt.onstop() })
  }, dur * 1000)
}

const getDur = dt => dt.duration.seconds

const playScore = (score, context) => {
  score.body.parts.forEach(part => playPart(part, context))
}

const playPart = (part, context) => {
  part.staves.forEach(staff => playStaff(staff, context))
}

const playStaff = (staff, context) => {
  staff.cells.forEach(cell => {
    cell.data.forEach(dt => {
      switch (dt.name) {
        case 'note': return playNote(dt, context)
        case 'chord': return playChord(dt, context)
      }
    })
  })
}

const playCell = (cell, context) => {
  cell.data.forEach(dt => {
    switch (dt.name) {
      case 'note': playNote(dt, context); break
      case 'rest': break
      case 'chord': playChord(dt, context); break
    }
  })
}

const playNote = (note, context) => {
  const { pitch, duration } = note
  tos.push(setTimeout(() => {
    console.log(`play: ${note}`, pitch.frequency)
    const { tie } = note
    if (tie) {
      if (tie.type !== 'begin') return
      const pairs = getTiedDtPitchPairs({ dt: note })
      playTiedPairs(pitch, pairs, context)
      chordOnplay(pairs)
    } else {
      note.onplay()
      const dur = getDur(note)
      midiPlay(0, pitch.midiNumber, dur, () => note.onstop(), context)
    }
  }, note.t * 1000))
}

const playChord = (chord, context) => {
  const dur = getDur(chord)
  tos.push(setTimeout(() => {
    // console.log(`play: ${chord}`)

    // Call dt.onplay() for tied chords and notes.
    if (chord.tie && chord.tie.type === 'begin') {
      const pairs = getTiedDtPitchPairs({ dt: chord })
      chordOnplay(pairs)
    } else {
      chord.onplay()
      setTimeout(() => chord.onstop(), getDur(chord) * 1000)
    }

    // Play pitches.
    chord.pitches.forEach(pitch => {
      if (pitch.tie) {
        if (pitch.tie.type !== 'begin') return
        const pairs = getTiedDtPitchPairs({ dt: chord, pitch })
        playTiedPairs(pitch, pairs, context)
      } else {
        pitch.onplay()
        midiPlay(0, pitch.midiNumber, dur, () => pitch.onstop(), context)
      }
    })
  }, chord.t * 1000))
}
