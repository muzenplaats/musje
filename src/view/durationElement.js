import { el, Element } from '../utils/html'
import box from './box'

export default function durationElement(durationLayout) {
  const { linesLayout, beamsLayout, dotsLayout } = durationLayout
  const { type, dots } = durationLayout.duration

  const main = new Element(el('g', [
    // box(durationLayout, 'orange'),
    // beamsLayout ? box(beamsLayout, 'blue') : [],
    // dotsLayout ? box(dotsLayout) : [],
    type < 4 ? linesLayout.layouts.map(layout => el('rect', layout.rect)) : [],
    type > 4 ? beamsLayout.layouts.map(layout => el('rect', layout.rect)) : [],
    dots ? dotsLayout.layouts.map(layout => el('circle', layout.circle)) : []
  ])).create()

  return main
}
