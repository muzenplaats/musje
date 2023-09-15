import { play, pause, stop } from './playMIDI'
// import { play, pause, stop } from './playMIDI'

const AudioContext = window.AudioContext || window.webkitAudioContext
var _ctx

// Todo: Merge MIDI and oscillator supports...

export default class Player {
  constructor(obj) {
    this.obj = obj
  }

  get context() { return  _ctx || (_ctx = new AudioContext()) }

  play = play
  pause = pause
  stop = stop
}
