import { range } from '../utils/helpers'
import { el, Element } from '../utils/html'

export default function pitchElement(pitch) {
  const main = new Element(el('g', [
    el('circle', { cx: 20, cy: 20, r: 10}),
    el('text', { x: 20, y: 50 }, '5'),
    el('text', { x: 100, y: 120, style: 'text-anchor: middle' }, 6),
    range(5).map(n => el('circle', { cx: 100, cy: 100 - 5 * n, r: 2 }))
  ])).create()

  return main
}
