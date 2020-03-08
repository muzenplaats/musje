import AbstractLayout from './AbstractLayout'

export default class MultipartLayout extends AbstractLayout {
  constructor(multipart, style) {
    super()
    this.multipart = multipart
    this.style = style

    this.width = 20
    this.height = 20
  }
}
