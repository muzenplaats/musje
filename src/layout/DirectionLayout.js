import AbstractLayout from './AbstractLayout'

export default class DirectionLayout extends AbstractLayout {
  constructor(direction, style) {
    super()
    this.direction = direction
    this.style = style
  }
}
