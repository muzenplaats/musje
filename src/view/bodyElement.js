import { el } from '../utils/html'
import box from './box'

export default function headElement(bodyLayout) {

  return el.create('g', [
    box(bodyLayout, 'green'),
  ])
}
