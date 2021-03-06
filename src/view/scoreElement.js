import el from '../utils/el'
import box from './box'
import headElement from './headElement'
import bodyElement from './bodyElement'

export default function scoreElement(scoreLayout) {
  const { innerLayout, headLayout, bodyLayout } = scoreLayout

  return el.create('svg', scoreLayout.wh, [
    box(scoreLayout, 'gray'),
    // box(innerLayout, 'blue'),

    headElement(headLayout),
    bodyElement(bodyLayout)
  ])
}
