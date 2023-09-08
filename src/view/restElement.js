import el from '../utils/el'
import durationElement from './durationElement'
import box from './box'

export default function restElement(restLayout) {
  const { zeroLayout, durationLayout } = restLayout
  const style = `
    font-family: ${zeroLayout.family}
    font-size: ${zeroLayout.size}
    text-anchor: middle
  `

  return el.create('g', [
    // box(restLayout, 'green'),

    el('text', { ...restLayout.zeroLayout.cxby, style }, 0),
    durationElement(durationLayout)
  ])
}
