import el from '../utils/el'
import box from './box'

export default function durationElement(durationLayout) {
  const { linesLayout, beamsLayout, dotsLayout } = durationLayout
  const { duration } = durationLayout
  const { type, dots } = duration

  const linesElements = type < 4 ? linesLayout.layouts.map(layout => {
    return el.create('rect', layout.rect)
  }) : []
  const beamsElements = type > 4 ? beamsLayout.layouts.map(layout => {
    return el.create('rect', layout.rect)
  }) : []
  const dotsElements = dots ? dotsLayout.layouts.map(layout => {
    return el.create('circle', layout.circle)
  }) : []

  const setColor = color => {
    if (type < 4) {
      linesElements.forEach(element => { element.style.fill = color })
    } else if (type > 4) {
      beamsElements.forEach(element => { element.style.fill = color })
    }
    if (dots) dotsElements.forEach(element => {element.style.fill = color })
  }

  duration.onplay = () => setColor('#b5c')
  duration.onstop = () => setColor('black')

  return el.create('g', [
    // box(durationLayout, 'orange'),
    // beamsLayout ? box(beamsLayout, 'blue') : [],
    // dotsLayout ? box(dotsLayout) : [],
    linesElements,
    beamsElements,
    dotsElements
  ])
}
