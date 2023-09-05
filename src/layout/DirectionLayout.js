import AbstractLayout from './AbstractLayout'
import TextLayout from './TextLayout'

export default class DirectionLayout extends AbstractLayout {
  constructor(direction, style) {
    super()
    this.name = 'direction-layout'

    this.direction = direction
    this.style = style

    const { words, dynamics, wedge } = direction

    if (words) {
      this.textLayout = new TextLayout(words, style.directionFont)
    } else if (dynamics) {
      this.textLayout = new TextLayout(dynamics, style.dynamicsFont)
    }

    this.setSize()
  }

  setSize() {
    if (this.textLayout) {
      this.width = this.textLayout.width
      this.height = this.textLayout.height

    // tmp
    } else {
      this.width = 20
      this.height = 0
    }
    this.dx = this.width / 2
    this.dy = this.height
  }

  set position(pos) {
    super.position = pos
    const { x, y } = this
    if (this.textLayout) this.textLayout.position = { x, y }
  }
}
