import { el, Element } from '../utils/html'
import pitchElement from './pitchElement'
import durationElement from './durationElement'
import box from './box'

export default function noteElement(noteLayout) {
  const { pitchLayout, durationLayout } = noteLayout

  const main = new Element(el('g', [
    // box(noteLayout, 'green'),
    pitchElement(pitchLayout),
    durationElement(durationLayout)
  ])).create()

  return main
}
