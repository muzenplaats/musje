import el from '../utils/el'
import box from './box'
import braceElement from './braceElement'

export default function systemHeadElement(systemHeadLayout) {
  const { partNamesLayouts, bracesLayouts } = systemHeadLayout

  const getStyle = layout => `
    font-family: ${layout.family}
    font-size: ${layout.size}
    text-anchor: end
    alignment-baseline: middle
  `

  return el.create('g', [
    // box(systemHeadLayout, 'green'),
    // partNamesLayouts.map(layout => box(layout, 'green')),

    partNamesLayouts.map(layout => {
      return el('text', {
        ...layout.x2cy, style: getStyle(layout)
      }, layout.text)
    }),
    bracesLayouts ? bracesLayouts.map(layout => braceElement(layout)) : []
  ])
}
