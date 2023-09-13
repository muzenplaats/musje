import el from '../utils/el'
import noteElement from './noteElement'
import restElement from './restElement'
import chordElement from './chordElement'
import directionElement from './directionElement'
import box from './box'

export default function layerElement(layerLayout) {
  const { dataLayout } = layerLayout

  return el.create('g', [
    // box(layerLayout, 'orange'),
    // box(dataLayout, 'blue'),

    dataLayout.layouts.map(layout => {
      // return box(layout, 'orange')

      if ('note' in layout) return noteElement(layout)
      if ('rest' in layout) return restElement(layout)
      if ('chord' in layout) return chordElement(layout)
      if ('direction' in layout) return directionElement(layout)
    })
  ])
}
