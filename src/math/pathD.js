class PathD {
  constructor() {
    this.data = ''
  }
  moveTo(x, y) { this.data += `M${x} ${y}`; return this }
  moveBy(dx, dy) { this.data += `m${dx} ${dy}`; return this }
  lineTo(x, y) { this.data += `L${x} ${y}`; return this }
  lineBy(dx, dy) { this.data += `l${dx} ${dy}`; return this }
  horiTo(x) { this.data += `H${x}`; return this }
  horiBy(dx) { this.data += `h${dx}`; return this }
  vertTo(y) { this.data += `V${y}`; return this }
  vertBy(dy) { this.data += `v${dy}`; return this }
  curveTo(x1, y1, x2, y2, x, y) {
    this.data += `C${x1} ${y1},${x2} ${y2},${x}, ${y}`; return this
  }
  curveBy(dx1, dy1, dx2, dy2, dx, dy) {
    this.data += `C${dx1} ${dy1},${dx2} ${dy2},${dx}, ${dy}`; return this
  }
  close() { this.data += 'Z'; return this }

  lines(data) {
    if (!Array.isArray(data)) data = [data]
    data.forEach(dt => {
      const { x, y } = dt
      this.moveTo(x[0], y[0])
      x.forEach((xi, i) => this.lineTo(xi, y[i]))
    })
    return this.data
  }

  toString() { return this.data }
}

export default function pathD() { return new PathD() }
