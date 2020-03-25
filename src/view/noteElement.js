import el from '../utils/el'
import pitchElement from './pitchElement'
import durationElement from './durationElement'
import box from './box'

export default function noteElement(noteLayout) {
  const { pitchLayout, durationLayout } = noteLayout

  return el.create('g', [
    // box(noteLayout, 'green'),
    pitchElement(pitchLayout),
    durationElement(durationLayout)
  ])
}
