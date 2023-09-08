import el from '../utils/el'
import box from './box'

export default function barElement(barLayout) {
  const {
    bar, linesLayouts, dotsLayouts, displayLines, displayDots } = barLayout

  return el.create('g', [
    displayLines ? linesLayouts.map(layout => el('rect', layout.rect)) : [],

    displayDots && dotsLayouts ?
                dotsLayouts.map(layout => el('circle', layout.circle)) : []
  ])
}
