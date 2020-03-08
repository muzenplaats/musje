import { el, Element } from '../utils/html'
import noteElement from './noteElement'
import restElement from './restElement'
import chordElement from './chordElement'
import box from './box'

export default function cellElement(cellLayout) {
  const { dataLayout } = cellLayout
  const main = new Element(el('g', [
    // box(cellLayout, 'green'),
    // box(dataLayout, 'blue'),
    // dataLayout.layouts.map(layout => {
    //   // return box(layout, 'orange')
    //   if ('note' in layout) return noteElement(layout)
    //   if ('rest' in layout) return restElement(layout)
    //   if ('chord' in layout) return chordElement(layout)
    // })
  ])).create()

  return main
}
