import AbstractLayout from './AbstractLayout'

export default class MultipartLayout extends AbstractLayout {
  constructor(multipart, style) {
    super()
    this.name = 'multipart-layout'

    this.multipart = multipart
    this.style = style

    this.width = 50
    this.height = 50
  }

  set position(pos) {
    // super.position = pos
    super.position = { x: 100, y: 100 }
  }
}
