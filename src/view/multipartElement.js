import el from '../utils/el'
import noteElement from './noteElement'
import restElement from './restElement'
import chordElement from './chordElement'
import box from './box'

export default function cellElement(cellLayout) {
  const { dataLayout } = cellLayout

  return el.create('g', [
    // box(cellLayout, 'green'),
    // box(dataLayout, 'blue'),
    // dataLayout.layouts.map(layout => {
    //   // return box(layout, 'orange')
    //   if ('note' in layout) return noteElement(layout)
    //   if ('rest' in layout) return restElement(layout)
    //   if ('chord' in layout) return chordElement(layout)
    // })
  ])
}
