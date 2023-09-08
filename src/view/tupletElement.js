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

  const x1a = cx - halfTextWidth - textSep
  const y1a = y1 - lift + slope * (x1a - x1)

  const x2a = cx + halfTextWidth + textSep
  const y2a = y2 - lift + slope * (x2a - x2)

  const pathEl = el.create('path', {
    d: pathD().moveTo(x1, y1).vertBy(-lift).lineTo(x1a, y1a)
              .moveTo(x2, y2).vertBy(-lift).lineTo(x2a, y2a),
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
    // box(textLayout, 'orange'),

    pathEl,

    el.assign(elements, 'text').create('text', {
      ...textLayout.cxcy, style: getStyle(textLayout)
    }, textLayout.text)
  ])
}
