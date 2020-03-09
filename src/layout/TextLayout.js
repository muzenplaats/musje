import AbstractLayout from './AbstractLayout'
import { getSize } from '../utils/html'

export default class TextLayout extends AbstractLayout {
  constructor(text, fontStyle) {
    super()
    const width = getSize(fontStyle, text).width
    Object.assign(this, fontStyle, { width })
  }
}
