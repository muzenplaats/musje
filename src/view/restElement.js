import { el, Element } from '../utils/html'
import durationElement from './durationElement'
import box from './box'

export default function restElement(restLayout) {
  const { zeroLayout, durationLayout } = restLayout
  const style = `
    font-family: ${zeroLayout.family}
    font-size: ${zeroLayout.size}
    text-anchor: middle
  `

  const main = new Element(el('g', [
    // box(restLayout, 'green'),
    el('text', { ...restLayout.zeroLayout.cxby, style }, 0),
    durationElement(durationLayout)
  ])).create()

  return main
}
