import el from '../utils/el'
import box from './box'
import cellElement from './cellElement'
import barElement from './barElement'

export default function measureElement(measureLayout) {
  const { cellsLayouts, leftBarLayouts, rightBarLayouts } = measureLayout

  return el.create('g', [
    // box(measureLayout, 'green'),

    cellsLayouts.map(layout => cellElement(layout)),

    leftBarLayouts ? leftBarLayouts.map(layout => barElement(layout)) : [],
    rightBarLayouts ? rightBarLayouts.map(layout => barElement(layout)) : []
  ])
}
