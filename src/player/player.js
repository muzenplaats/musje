import play from './play'

var _ctx

class Player {
  constructor() {}
  get context() { return  _ctx || (_ctx = new AudioContext()) }
  play = play
}

export default new Player()
