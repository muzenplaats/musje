import AbstractLayout from './AbstractLayout'

export default class BodyLayout extends AbstractLayout {
  constructor(body, style) {
    super()
    this.body = body
    this.style = style
  }

  setWidth() {
    const { width, marginLeft, marginRight } = this.style.score
    this.width = width - marginLeft - marginRight
  }

  setHeight() {
    if (this.body.systems.length) {
      this.height = sum(this.systems.map(system => system.size.height)) +
                 (this.systems.length - 1) * this.style.body.systemsSep
    } else {
      this.height = 0
    }
  }

  set position(pos) {
    super.position = pos
    let { x, y } = this
    this.systems.forEach(system => {
      system.position = { x, y }
      y += system.size.height + this.style.body.systemsSep
    })
  }
}
