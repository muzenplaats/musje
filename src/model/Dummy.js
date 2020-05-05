export default class Dummy {
  constructor(data) {
    this.name = 'dummy'
    Object.assign(this, data)
  }

  toString() { return '[[Dummy]]'}
}
