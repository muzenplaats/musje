import { sum } from '../utils/helpers'

const tos = []

export function play(obj) {
  const { context } = this
  switch (obj.name) {
    case 'score': playScore(obj, context); break
    case 'part': playPart(obj, context); break
    case 'staff': playStaff(obj, context); break
    case 'cell': playCell(obj, context); break
    case 'note': playNote(obj, context); break
  }
}

export function stop() {
  tos.forEach(clearTimeout)
  tos.length = 0
}

const oscPlay = (t, freq, dur, onended, context) => {
  const currTime = context.currentTime
  const gn = context.createGain()
  gn.connect(context.destination);

  gn.gain.setValueAtTime(0, t + currTime)
  gn.gain.linearRampToValueAtTime(0.5, t + currTime + 0.05)
  gn.gain.linearRampToValueAtTime(0.5, t + currTime + dur - 0.05)
  gn.gain.linearRampToValueAtTime(0, t + currTime + dur - 0.01)

  const osc = context.createOscillator()
  osc.frequency.value = freq
  osc.connect(gn)
  osc.start(currTime + t)
  osc.stop(currTime + t + dur)
  if (onended) { osc.onended = onended }
}

const getTiedNotes = note => {
  const { tie } = note
  const notes = [note]
  let nnote = tie.nextNote
  while (nnote) {
    notes.push(nnote)
    if (nnote.tie) nnote = nnote.tie.nextNote
  }
  return notes
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
    // console.log(`play: ${note}`, pitch.frequency)
    const { tie } = note
    if (tie) {
      if (tie.type === 'begin') {
        const notes = getTiedNotes(note)
        notes.forEach(note => note.onplay())
        const dur = sum(notes.map(note => getDur(note)))
        const stopHandler = () => notes.forEach(note => note.onstop())
        oscPlay(0, pitch.frequency, dur, stopHandler, context)
      }
    } else {
      note.onplay()
      const dur = getDur(note)
      oscPlay(0, pitch.frequency, dur, () => note.onstop(), context)
    }
  }, note.t * 1000))
}

const playChord = (chord, context) => {
  const dur = getDur(chord)
  tos.push(setTimeout(() => {
    // console.log(`play: ${chord}`)
    chord.onplay()
    chord.pitches.forEach(pitch => {
      oscPlay(0, pitch.frequency, dur, () => chord.onstop(), context)
    })
  }, chord.t * 1000))
}
