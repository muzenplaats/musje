
export default function play(obj) {
  const { context } = this
  switch (obj.name) {
    case 'note': playNote(0, obj, context); break
    case 'cell': playCell(0, obj, context); break
  }
}

const oscPlay = (t, freq, dur, onended, context) => {
  const osc = context.createOscillator()
  osc.frequency.value = freq
  osc.connect(context.destination)
  osc.start(context.currentTime + t)
  osc.stop(context.currentTime + t + dur)
  if (onended) { osc.onended = onended }
}

const getDur = dt => dt.duration.quarters * 60 / 90

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
    }
  })
}

const playNote = (t, note, context) => {
  const { pitch, duration } = note
  const dur = getDur(note)
  console.log(`play: ${note}`, pitch.frequency)
  oscPlay(t, pitch.frequency, dur, () => console.log('stop'), context)
}
