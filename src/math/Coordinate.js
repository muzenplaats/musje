import M from './M'


export default class {
  constructor(limit, rect) {
    this.xParams = Object.assign({}, limit.x, rect)
    this.yParams = Object.assign({}, limit.y, rect)
  }

  transform(data) {
    return {
      x: M('(x - min) / range * width + x1', { ...data, ...this.xParams }),
      y: M('(1 - (y - min) / range) * height + y1', { ...data, ...this.yParams })
    }
  }

  transformDataset(dataset) {
    return dataset.map(data => this.transform(data))
  }

  lines(data) { return this.transform(data) }

  vlines(data) {
    const { x, y } = this.transform({
      x: M.range.apply(null, data.x), y: data.y
    })
    return x.map(xi => ({ x: [xi, xi], y: [y, y - data.height] }))
  }

  hlines(data) {
    const { x, y } = this.transform({
      x: data.x, y: M.range.apply(null, data.y)
    })
    return y.map(yi => ({ x: [x, x + data.width], y: [yi, yi] }))
  }

  text(data) {
    const { x, y } = this.transform(data)
    return { x, y, content: data.content }
  }

  xnums(data) {
    const t = M.range.apply(null, data.x)
    const { x, y } = this.transform({ x: t, y: data.y })
    return t.map((text, i) => ({ x: x[i], y, text }))
  }

  ynums(data) {
    const t = M.range.apply(null, data.y)
    const fontSize = 12
    let { x, y } = this.transform({ x: data.x, y: t })
    y = M('y + fontSize / 2', { y, fontSize })
    return t.map((text, i) => ({ x, y: y[i], text }))
  }
}
