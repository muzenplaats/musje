import el from '../utils/el'

export default function barElement(barLayout) {
  const { bar, linesLayouts, dotsLayouts } = barLayout

  return el.create('g', [
    linesLayouts.map(layout => el('rect', layout.rect)),
    dotsLayouts ? dotsLayouts.map(layout => el('circle', layout.circle)) : []
  ])
}
