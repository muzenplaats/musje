import { play, pause, stop } from './play'

const AudioContext = window.AudioContext || window.webkitAudioContext
var _ctx

export default class Player {
  constructor(obj) {
    this.obj = obj
  }

  get context() { return  _ctx || (_ctx = new AudioContext()) }

  play = play
  pause = pause
  stop = stop
}
