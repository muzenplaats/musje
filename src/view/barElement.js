import { el, Element } from '../utils/html'

export default function barElement(barLayout) {
  const { bar, linesLayouts, dotsLayouts } = barLayout

  const main = new Element(el('g', [
    linesLayouts.map(layout => el('rect', layout.rect)),
    dotsLayouts ? dotsLayouts.map(layout => el('circle', layout.circle)) : []
  ])).create()

  return main
}
