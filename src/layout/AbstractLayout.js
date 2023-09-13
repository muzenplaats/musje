
/*
  Rect: { x, y, width height }
  Derived: { x1, y1, cx, cy, x2, y2 }

      (x, y)    x1
  = (x1, y1)    x   bx           cx                y2  |
                |    |            |                 |  v
        y1  y - +-----------------------------------+ -----
                |    :            .                 | dy  ^
           by - | ...:..............................| --  |
                |    :            .                 |  ^
                |    :            |                 |  |
           cy - | . -- . -- . -- . -- . -- .-- . -- |     height
                |    :            |                 | dy2
                |    :            .                 |
                |    :            |                 |  |  |
                |    :            .                 |  v  v
          y2 - +------------------------------------+ -----
              ->| dx |<-            dx2           ->|  (x2, y2)
                |<-             width             ->|

  Rect displacement: { dx, dy }
  Derived: { dx2, dy2, bx, by}
*/


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

  set x(n) { this._x = n }
  get x() {
    if (typeof this._x === 'undefined') {
      throw new Error('In ' + this.name + ': x is not defined.')
    }
    return this._x
  }

  set y(n) { this._y = n }
  get y() {
    if (typeof this._y === 'undefined') {
      throw new Error('In ' + this.name + ': y is not defined.')
    }
    return this._y
  }

  set width(w) { 
    if (isNaN(w)) {
      throw new TypeError(`In ${this.name}: width must be a number but ${w} is set.`)
    }
    this._width = w
  }

  get width() { return this._width }

  set height(h) { 
    if (isNaN(h)) {
      throw new TypeError(`In ${this.name}: height must be a number but ${h} is set.`)
    }
    this._height = h 
  }

  get height() { return this._height }

  set position(pos) {
    Object.assign(this, pos) 

    if (isNaN(this.x) || isNaN(this.y)) {
      throw new TypeError(`Position of ${this.name} must be composed of numbers; get: { x: ${this.x}, y: ${this.y} }\n` +
                          `Caused by #position = ${JSON.stringify(pos, null, 2)}`)
    }
  }

  get wh() { return { width: this.width, height: this.height } }
  get xy() { return { x: this.x, y: this.y } }
  get xby() { return { x: this.x, y: this.by } }
  get cxby() { return { x: this.cx, y: this.by } }
  get x2by() { return { x: this.x2, y: this.by } }
  get x2cy() { return { x: this.x2, y: this.cy } }
  get cxcy() { return { x: this.cx, y: this.cy } }

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
