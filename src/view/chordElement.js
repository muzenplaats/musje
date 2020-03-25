import el from '../utils/el'
import pitchElement from './pitchElement'
import durationElement from './durationElement'
import box from './box'

export default function chordElement(chordLayout) {
  const { pitchesLayout, durationLayout } = chordLayout

  return el.create('g', [
    // box(chordLayout, 'green'),
    pitchesLayout.layouts.map(layout => pitchElement(layout)),
    durationElement(durationLayout)
  ])
}
