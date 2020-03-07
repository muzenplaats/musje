import { el, Element } from '../utils/html'
import pitchElement from './pitchElement'
import durationElement from './durationElement'
import box from './box'

export default function chordElement(chordLayout) {
  const { pitchesLayout, durationLayout } = chordLayout

  const main = new Element(el('g', [
    // box(chordLayout, 'green'),
    pitchesLayout.layouts.map(layout => pitchElement(layout)),
    durationElement(durationLayout)
  ])).create()

  return main
}
