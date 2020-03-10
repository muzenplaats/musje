import AbstractLayout from './AbstractLayout'
import { getSize } from '../utils/html'

export default class TextLayout extends AbstractLayout {
  constructor(text, fontStyle) {
    super()
    Object.assign(this, fontStyle)
    this.width = getSize(fontStyle, text).width
  }
}
