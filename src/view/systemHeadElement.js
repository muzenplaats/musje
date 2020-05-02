import el from '../utils/el'
import box from './box'

export default function systemHeadElement(systemHeadLayout) {

  return el.create('g', [
    box(systemHeadLayout, 'green')
  ])
}
