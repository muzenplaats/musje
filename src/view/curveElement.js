import el from '../utils/el'
import box from './box'

export default function curveElement(curveLayout) {
  const { x1, y1, x2, y2 } = curveLayout.endPoints
  const { tie, slur } = curveLayout
  const d = `M${x1} ${y1}, L${x2} ${y2}`

  const pathEl = el.create('path', {
    d, style: 'stroke-width: 1; stroke: black'
  })

  const setColor = color => {
    pathEl.style.stroke = color
  }

  if (tie) {
    tie.onplay = () => setColor('#b5c')
    tie.onstop = () => setColor('black')
  } else if (slur) {
    slur.onplay = () => setColor('#b5c')
    slur.onstop = () => setColor('black')
  }

  return el.create('g', [
    box(curveLayout, 'orange'),
    pathEl
  ])
}
