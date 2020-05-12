import el from '../utils/el'
import box from './box'
import systemElement from './systemElement'

export default function bodyElement(bodyLayout) {
  const { systemsLayouts } = bodyLayout

  return el.create('g', [
    // box(bodyLayout, 'green'),

    systemsLayouts.map(layout => systemElement(layout))
  ])
}
