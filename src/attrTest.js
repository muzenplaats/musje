import el from './utils/el'

export default function attrTest() {
  const data = el.setData({
    angle: 0,
    width: 200,
    height: 100,
    area: { get() { return this.width * this.height } },
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

  el.linkData(data, 'area', () => { area.width = data.area * 0.01 })

  const objA = el.setData({
    propA: 'a '
  })
  const objB = el.setData({
    propB: 'b ',
    propB1: 'b1 '
  })
  const objC = el.setData({
    propC: 'c '
  })
  el.linkData(objA, 'propA', objB, 'propB', 'propB1', () => {
    objC.propC = objA.propA + objB.propB + objB.propB1
  })
  console.log(objC.propC)   // a b b1
  objA.propA = 'aa '
  console.log(objC.propC)   // aa b b1
  objB.propB = 'bb '
  console.log(objC.propC)   // aa bb b1
  objB.propB1 = 'b1b1 '
  console.log(objC.propC)   // aa bb b1b1

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
      el('text', { x: 20, y: 350 }, data.$display),
      el('svg:a', { href: 'https://github.com/malcomwu/musje' }, [
        el('circle', { cx: 200, cy: 100, r: 10})
      ])
    ]),

    el('div', [
      'a link',
      el('a', { href: 'https://github.com/malcomwu/musje  ' }, 'test link'),
      'is it.'
    ]),

    el('style', `
      .test {
        color: blue;
      }
    `)
  ])
}
