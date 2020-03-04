import AbstractLayout from './AbstractLayout'

export default class Layout extends AbstractLayout {
  constructor(pos, size) {
    super()
    Object.assign(this, size, pos)
  }
}
