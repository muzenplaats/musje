import el from '../utils/el'
import box from './box'
import measureElement from './measureElement'

export default function systemElement(systemLayout) {
  const { measuresLayouts } = systemLayout

  return el.create('g', [
    box(systemLayout, 'green'),
    measuresLayouts.map(layout => measureElement(layout))
  ])
}
