var _ctx
const getContext = () => _ctx || (_ctx = new AudioContext())

export const play = (f) => {
  const context = getContext()
  var oscillator = context.createOscillator();

  oscillator.type = 'square'
  oscillator.frequency.setValueAtTime(f, context.currentTime) // value in hertz
  oscillator.connect(context.destination)
  oscillator.start()
}
