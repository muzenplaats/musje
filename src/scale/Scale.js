import Pitch from '../model/Pitch'

export default class Scale {
  constructor(sclPitch) {
    this.name = 'scale'
    if (sclPitch.name === 'scl-pitch') {
      this.sclPitch = sclPitch
    } else {
      this.midiNumber = sclName
    }
  }

  get frequency() {
    const { midiNumber } = this
    if (midiNumber) return new Pitch({ midiNumber }).frequency
    return // Todo
  }

  toString() {}
  toJSON() {}
}
