import el from '../utils/el'
import pitchElement from './pitchElement'
import durationElement from './durationElement'
import curveElement from './curveElement'
import box from './box'

export default function noteElement(noteLayout) {
  const { pitchLayout, durationLayout, tieLayout } = noteLayout

  return el.create('g', [
    // box(noteLayout, 'green'),
    pitchElement(pitchLayout),
    durationElement(durationLayout),
    tieLayout && tieLayout.tie.type !== 'end' ? curveElement(tieLayout) : []
  ])
}
