import { play, stop } from './play'

const AudioContext = window.AudioContext || window.webkitAudioContext
var _ctx

class Player {
  constructor() {}
  get context() { return  _ctx || (_ctx = new AudioContext()) }
  play = play
  stop = stop
}

export default new Player()
