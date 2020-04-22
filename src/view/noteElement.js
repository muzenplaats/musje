import el from '../utils/el'
import pitchElement from './pitchElement'
import durationElement from './durationElement'
import curveElement from './curveElement'
import box from './box'

export default function noteElement(noteLayout) {
  const { pitchLayout, durationLayout, tieLayout } = noteLayout

  const showTie = tieLayout => {
    if (!tieLayout) return false
    const { tie } =  tieLayout
    return tie.type !== 'end' || tie.showPrev
  }

  return el.create('g', [
    // box(noteLayout, 'green'),
    pitchElement(pitchLayout),
    durationElement(durationLayout),
    showTie(tieLayout) ? curveElement(tieLayout) : []
  ])
}
