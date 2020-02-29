const tos = []

export function play(obj) {
  const { context } = this
  switch (obj.name) {
    case 'note': playNote(0, obj, context); break
    case 'cell': playCell(0, obj, context); break
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

const getDur = dt => dt.duration.quarters * 60 / 120

// export const playStaff = staff => {
//   staff.cells.forEach(cell => {
//     cell.data.forEach(dt => {
//       switch (dt.name) {
//         case 'note': return playNote(dt)
//         case 'chord': return playChord(dt)
//       }
//     })
//   })
// }

const playCell = (t, cell, context) => {
  const tempo = 60 / 90
  cell.data.forEach(dt => {
    switch (dt.name) {
      case 'note':
        playNote(t, dt, context)
        t += getDur(dt)
        break
      case 'rest':
        t += getDur(dt)
        break
      case 'chord':
        playChord(t, dt, context)
        t += getDur(dt)
    }
  })
}

const playNote = (t, note, context) => {
  const { pitch, duration } = note
  const dur = getDur(note)
  tos.push(setTimeout(() => {
    console.log(`play: ${note}`, pitch.frequency)
    oscPlay(0, pitch.frequency, dur, () => console.log('stop'), context)
  }, t * 1000))
}

const playChord = (t, chord, context) => {
  const dur = getDur(chord)
  tos.push(setTimeout(() => {
    console.log(`play: ${chord}`)
    chord.pitches.forEach(pitch => {
      oscPlay(0, pitch.frequency, dur, () =>console.log('stop'), context)
    })
  }, t * 1000))
}
