import el from '../utils/el'
import box from './box'
import { flatten } from '../utils/helpers'

export default function durationElement(durationLayout) {
  const { linesLayout, beamsLayout, dotsLayout } = durationLayout
  const { duration } = durationLayout
  const { type, dots } = duration
  const elements = {}

  const setColor = color => {
    const setFillColor = element => {
      element.style.fill = color
    }

    if (type < 4) {
      elements.lines.forEach(setFillColor)
    } else if (elements.beams) {
      elements.beams.forEach(setFillColor)
    }

    if (dots) {
      elements.dots.forEach(setFillColor)
    }
  }

  duration.onplay = () => setColor('#b5c')
  duration.onstop = () => setColor('black')

  return el.create('g', [
    // box(durationLayout, 'orange'),
    // beamsLayout ? box(beamsLayout, 'blue') : [],
    // dotsLayout ? box(dotsLayout) : [],

    type < 4 ? linesLayout.layouts.map(layout => {
      return el.push(elements, 'lines').create('rect', layout.rect)
    }) : [],

    type > 4 ? flatten(beamsLayout.layouts.map(layout => {
      const { type: btype } = layout.beam

      if (btype === 'single' || btype === 'begin') {
        const rect = Object.assign({}, layout.rect)

        if (btype === 'begin') {
          rect.width = layout.beamedWidth
        }

        return el.push(elements, 'beams').create('rect', rect)
      }

      return []
    })) : [],

    dots ? dotsLayout.layouts.map(layout => {
      return el.push(elements, 'dots').create('circle', layout.circle)
    }) : []
  ])
}
