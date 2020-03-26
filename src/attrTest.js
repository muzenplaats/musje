import el from './utils/el'

export default function attrTest() {
  const data = el.setData({
    angle: 0,
    width: 200,
    height: 100,
    area: { get() { return this.width * this.height } },

    // hack
    nomArea: {
      get() { if (area) area.width = this.area * 0.01 },
      dep: 'area'
    },

    rotate: { get() { return `rotate(${this.angle}, 250, 150)` }},
    display: { get() {
      return `Angle: ${this.angle}<sup>o</sup>,
              width: ${this.width.toFixed(2)},
              height: ${this.height.toFixed(2)},
              area: ${this.area.toFixed(2)}<sup>test</sup>`
    }}
  })
  const area = el.setData({
    x: 20,
    y: 300,
    width: 0,
    height: 10
  })

  setInterval(() => { data.angle++ }, 50)
  setInterval(() => {
    const dw = (Math.random() - 0.5) * 20
    data.width += data.width + dw > 0 ? dw : 0
  }, 70)
  setInterval(() => {
     const dh = (Math.random() - 0.5) * 15
     data.height += data.height + dh > 0 ? dh : 0
   }, 90)

  document.addEventListener('keydown', event => {
    switch (event.key) {
      case 'ArrowRight': area.x += 5; break
      case 'ArrowLeft': area.x -= 5; break
      case 'ArrowUp': area.y -= 5; break
      case 'ArrowDown': area.y += 5; break
    }
  })

  return el.create('div', { class: 'test' }, [
    el('h1', { style: 'font-size: 20' }, 'What is this?'),
    el.html('div', data.$width),
    el.html('div', data.$display),
    el('svg', { width: 500, height: 400 }, [
      el('rect', { x: 200, y: 100, width: data.$width, height: data.$height,
                   transform: data.$rotate }),
      el('rect', {
        x: area.$x, y: area.$y, width: area.$width, height: area.$height
      }),
      el('text', { x: 20, y: 350 }, data.$display)
    ]),

    el('style', `
      .test {
        color: blue;
      }
    `)
  ])
}
