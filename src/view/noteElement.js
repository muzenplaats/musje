import el from '../utils/el'
import pitchElement from './pitchElement'
import durationElement from './durationElement'
import curveElement from './curveElement'
import box from './box'
import { flatten } from '../utils/helpers'

export default function noteElement(noteLayout) {
  const { pitchLayout, durationLayout, tieLayout,
          beginSlursLayouts, endSlursLayouts } = noteLayout

  const showTie = tieLayout => {
    if (!tieLayout) return false
    const { tie } =  tieLayout
    return tie.type !== 'end' || tieLayout.showPrev
  }

  return el.create('g', [
    // box(noteLayout, 'green'),
    pitchElement(pitchLayout),
    durationElement(durationLayout),
    showTie(tieLayout) ? curveElement(tieLayout) : [],
    beginSlursLayouts ? beginSlursLayouts.map(layout => {
      return curveElement(layout)
    }) : [],
    endSlursLayouts ? flatten(endSlursLayouts.map(layout => {
      return layout.showPrev ? curveElement(layout) : []
    })) : []
  ])
}
