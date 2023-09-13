import el from '../utils/el'
import layerElement from './layerElement'
import box from './box'

export default function multipartElement(multipartLayout) {
  const { layersLayouts } = multipartLayout

  return el.create('g', [
    box(multipartLayout, 'green'),

    layersLayouts.map(layerElement)
  ])
}
