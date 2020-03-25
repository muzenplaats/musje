import el from '../utils/el'
import box from './box'

export default function headElement(bodyLayout) {

  return el.create('g', [
    box(bodyLayout, 'green'),
  ])
}
