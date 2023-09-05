
export default class AbstractLayout {
  set x1(n) { this.x = n }
  get x1() { return this.x }
  set y1(n) { this.y = n }
  get y1() { return this.y }

  set x2(n) { this.x = n - this.width }
  get x2() { return this.x + this.width }
  set y2(n) { this.y = n - this.height }
  get y2() { return this.y + this.height }

  set cx(n) { this.x = n - this.width / 2 }
  get cx() { return this.x + this.width / 2 }
  set cy(n) { this.y = n - this.height / 2 }
  get cy() { return this.y + this.height / 2 }

  set dx2(n) { this.dx = this.width - n }
  get dx2() { return this.width - this.dx }
  set dy2(n) { this.dy = this.height - n }
  get dy2() { return this.height - this.dy }

  set bx(n) { this.x = n - this.dx }
  get bx() { return this.x + this.dx }
  set by(n) { this.y = n - this.dy }
  get by() { return this.y + this.dy }

  set position(pos) { Object.assign(this, pos) }

  get wh() { return { width: this.width, height: this.height }}
  get xy() { return { x: this.x, y: this.y } }
  get xby() { return { x: this.x, y: this.by } }
  get cxby() { return { x: this.cx, y: this.by }}
  get x2by() { return { x: this.x2, y: this.by }}
  get x2cy() { return { x: this.x2, y: this.cy }}
  get cxcy() { return { x: this.cx, y: this.cy }}
  get rect() {
    const { x, y, width, height } = this
    return { x, y, width, height }
  }
  get circle() {
    const { cx, cy, r } = this
    return { cx, cy, r }
  }

  toJSON() {
    const { name, x, y, width, height, x2, y2, cx, cy, bx, by, dx, dy } = this
    return { name, x, y, width, height, x2, y2, cx, cy, bx, by, dx, dy }
  }
}
