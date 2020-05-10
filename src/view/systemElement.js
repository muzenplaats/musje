import el from '../utils/el'
import box from './box'
import systemHeadElement from './systemHeadElement'
import measureElement from './measureElement'

export default function systemElement(systemLayout) {
  const { headLayout, measuresLayouts } = systemLayout

  return el.create('g', [
    // box(systemLayout, 'green'),

    headLayout ? systemHeadElement(headLayout) : [],
    measuresLayouts.map(layout => measureElement(layout))
  ])
}
