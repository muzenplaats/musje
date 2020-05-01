import el from '../utils/el'
import box from './box'
import pathD from '../math/pathD'

export default function curveElement(curveLayout) {
  const { tie, slur, lift, strokeWidth } = curveLayout
  let endPoints
  if (tie) {
    endPoints = curveLayout.showPrev ? curveLayout.prevEndPoints :
                                       curveLayout.endPoints
  } else if (slur) {
    endPoints = slur.value === '(' ? curveLayout.endPoints : curveLayout.prevEndPoints
  }
  const { x1, y1, x2, y2 } = endPoints

  const dx = x2 - x1
  const dy = y2 - y1

  const cx11 = x1 + dx / 6
  const cy11 = y1 + dy / 6 - lift
  const cx12 = x2 - dx / 6
  const cy12 = y2 - dy / 6 - lift

  const cx21 = cx11
  const cy21 = cy11 + strokeWidth
  const cx22 = cx12
  const cy22 = cy12 + strokeWidth

  const pathEl = el.create('path', {
    d: pathD().moveTo(x1, y1)
              .curveTo(cx11, cy11, cx12, cy12, x2, y2)
              .curveTo(cx22, cy22, cx21, cy21, x1, y1),
    style: 'fill: black'
  })

  const setColor = color => {
    pathEl.style.fill = color
  }

  if (tie) {
    tie.onplay = () => setColor('#b5c')
    tie.onstop = () => setColor('black')
  } else if (slur) {
    slur.onplay = () => setColor('#b5c')
    slur.onstop = () => setColor('black')
  }

  return el.create('g', [
    // box(curveLayout, 'orange'),
    pathEl
  ])
}
