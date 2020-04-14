import el from '../utils/el'
import box from './box'
import cellElement from './cellElement'

export default function measureElement(measureLayout) {
  const { cellsLayouts } = measureLayout

  return el.create('g', [
    box(measureLayout, 'green'),
    cellsLayouts.map(layout => cellElement(layout))
  ])
}
