
export default class PlayStopHandleInterface {

  get onplay() { return this._onplay || this.defaultOnplay.bind(this) }

  set onplay(newf) {
    const oldf = this.onplay
    this._onplay = () => { oldf(); newf() }
  }

  get onstop() { return this._onstop || this.defaultOnstop.bind(this) }

  set onstop(newf) {
    const oldf = this.onstop
    this._onstop = () => { oldf(); newf() }
  }

  defaultOnplay() {}
  defaultOnstop() {}
}
