import AbstractLayout from './AbstractLayout'

export default class MultipartLayout extends AbstractLayout {
  constructor(multipart, style) {
    super()
    this.name = 'multipart-layout'

    this.multipart = multipart
    this.style = style

    this.width = 60
    this.height = 30
    this.dx = 25
    this.dy = 25
  }

  set position(pos) {
    super.position = pos
  }
}
