class PathD {
  constructor() {
    this.data = ''
  }
  clear() { this.data = ''; return this }
  moveTo(x, y) { this.data += `M${x},${y}`; return this }
  lineTo(x, y) { this.data += `L${x},${y}`; return this }

  lines(data) {
    this.clear()
    if (!Array.isArray(data)) data = [data]
    data.forEach(dt => {
      const { x, y } = dt
      this.moveTo(x[0], y[0])
      x.forEach((xi, i) => this.lineTo(xi, y[i]))
    })
    return this.data
  }
}

export default new PathD()
