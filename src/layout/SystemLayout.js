import AbstractLayout from './AbstractLayout'

export default class SystemLayout extends AbstractLayout {
  constructor(measures, style) {
    super()
    this.measures = measures
    this.style = style
  }
}
