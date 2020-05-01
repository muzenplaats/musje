class PathD {
  constructor() {
    this.data = ''
  }
  moveTo(x, y) { this.data += `M${x} ${y}`; return this }
  lineTo(x, y) { this.data += `L${x} ${y}`; return this }
  vertTo(y) { this.data += `V${y}`; return this }
  vertBy(dy) { this.data += `v${dy}`; return this }
  curveTo(x1, y1, x2, y2, x, y) {
    this.data += `C${x1} ${y1},${x2} ${y2},${x}, ${y}`; return this
  }

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
