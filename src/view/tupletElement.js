import el from '../utils/el'
import box from './box'
import pathD from '../math/pathD'

export default function tupletElement(tupletLayout) {
  const { tuplet, textLayout, lift, strokeWidth, pitchTupletSep } = tupletLayout
  let { x1, y1, x2, y2 } = tupletLayout.endPoints
  const cx = (x1 + x2) / 2
  const halfTextWidth = textLayout.width / 2
  const textSep = 3 // tmp
  const slope = (y2 - y1) / (x2 - x1)

  y1 -= pitchTupletSep
  y2 -= pitchTupletSep

  const x11 = x1
  const y11 = y1 - lift
  const x12 = cx - halfTextWidth - textSep
  const y12 = y11 + slope * (x12 - x1)

  const x21 = x2
  const y21 = y2 - lift
  const x22 = cx + halfTextWidth + textSep
  const y22 = y21 + slope * (x22 - x2)

  const pathEl = el.create('path', {
    d: pathD().moveTo(x1, y1).vertBy(-lift).lineTo(x12, y12)
              .moveTo(x2, y2).lineTo(x21, y21).lineTo(x22, y22),
    // d: pathD().moveTo(x1, y1).lineTo(x11, y11).lineTo(x12, y12)
    //           .moveTo(x2, y2).lineTo(x21, y21).lineTo(x22, y22),
    style: `stroke-width: ${strokeWidth}; stroke: black; fill: none`
  })

  const elements = {}
  const setColor = color => {
    pathEl.style.stroke = color
    elements.text.style.fill = color
  }

  tuplet.onplay = () => setColor('#b5c')
  tuplet.onstop = () => setColor('black')

  const getStyle = ({ family, size }) => `
    font-family: ${family}
    font-size: ${size}
    text-anchor: middle
    alignment-baseline: middle
  `

  return el.create('g', [
    // box(curveLayout, 'orange'),
    pathEl,
    el.assign(elements, 'text').create('text', {
      x: textLayout.cx, y: textLayout.by,
      style: getStyle(textLayout)
    }, textLayout.text)
  ])
}
