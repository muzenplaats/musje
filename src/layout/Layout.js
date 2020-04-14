import AbstractLayout from './AbstractLayout'

export default class Layout extends AbstractLayout {
  constructor(pos, size) {
    super()
    this.name = 'layout'
    Object.assign(this, size, pos)
  }
}
