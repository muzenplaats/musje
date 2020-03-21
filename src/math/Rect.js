export default class {
  constructor(rect) {
    this.x1 = rect.x1
    this.y1 = rect.y1
    this.width = rect.width
    this.height = rect.height
  }

  get x() { return this.x1 }
  get y() { return this.y1 }
  get cx() { return this.x1 + this.width / 2 }
  get cy() { return this.y1 + this.height / 2 }
  get x2() { return this.x1 + this.width }
  get y2() { return this.y1 + this.height }

  get rect() {
    const { x, y, width, height } = this
    return { x, y, width, height }
  }
}
