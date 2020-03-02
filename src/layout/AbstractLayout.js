import { makeToJSON } from '../utils/helpers'

export default class AbstractLayout {
  set x2(n) { this.x = n - this.width }
  get x2() { return this.x + this.width }
  set y2(n) { this.y = n - this.height }
  get y2() { return this.y + this.height }

  set cx(n) { this.x = n - this.width / 2 }
  get cx() { return this.x + this.width / 2 }
  set cy(n) { this.y = n - this.height / 2 }
  get cy() { return this.y + this.height / 2 }

  set bx(n) { this.x = n - this.dx }
  get bx() { return this.x + this.dx }
  set by(n) { this.y = n - this.dy }
  get by() { return this.y + this.dy }

  set position(pos) { Object.assign(this, pos) }

  get xy() { return { x: this.x, y: this.y } }
  get cxby() { return { x: this.cx, y: this.by }}
  get rect() {
    const { x, y, width, height } = this
    return { x, y, width, height }
  }

  toJSON() {
    const { x, y, width, height, x2, y2, cx, cy, bx, by, dx, dy } = this
    return { x, y, width, height, x2, y2, cx, cy, bx, by, dx, dy }
  }
}
