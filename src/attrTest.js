import el from './utils/el'

export default function attrTest() {
  const data = el.setData({
    angle: 0,
    width: 200,
    height: 100,
    area: { get() { return this.width * this.height } },
    nomArea: { get() { return this.area * 0.01 }},
    rotate: { get() { return `rotate(${this.angle}, 250, 150)` }},
    display: { get() {
      return `Angle: ${this.angle}, width: ${this.width.toFixed(2)},
              height: ${this.height.toFixed(2)},
              area: ${this.area.toFixed(2)}`
    }}
  })

  setInterval(() => { data.angle++ }, 50)
  setInterval(() => {
    const dw = (Math.random() - 0.5) * 30
    data.width += data.width + dw > 0 ? dw : 0
  }, 70)
  setInterval(() => {
     const dh = (Math.random() - 0.5) * 25
     data.height += data.height + dh > 0 ? dh : 0
   }, 90)

  return el.create('div', { class: 'test' }, [
    el('div', 'test'),
    el('svg', { width: 500, height: 500 }, [
      el('rect', { x: 200, y: 100, width: data.$width, height: data.$height,
                   transform: data.$rotate }),
      el('rect', { x: 20, y: 300, width: data.$nomArea, height: 10 }),
      el('text', { x: 100, y: 350 }, data.$display)
    ]),

    el('style', `
      .test {
        color: blue;
      }
    `)
  ])
}
