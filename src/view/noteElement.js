import el from '../utils/el'
import pitchElement from './pitchElement'
import durationElement from './durationElement'
import curveElement from './curveElement'
import box from './box'
import { flatten } from '../utils/helpers'

export default function noteElement(noteLayout) {
  const { note, pitchLayout, durationLayout, tieLayout,
          beginSlursLayouts, endSlursLayouts, lyricsLayouts } = noteLayout

  const showTie = tieLayout => {
    if (!tieLayout) return false
    const { tie } =  tieLayout
    return tie.type !== 'end' || tieLayout.showPrev
  }

  const getStyle = ({ family, size, anchor }) => `
    font-family: ${family}
    font-size: ${size}
    text-anchor: ${anchor}
  `

  const elements = {}

  const setColor = color => {
    const { lyrics } =  elements
    if (lyrics) lyrics.forEach(element => element.style.fill = color)
  }

  // note.onplay = () => setColor('#b5c')
  note.onplay = () => setColor('blue')
  note.onstop = () => setColor('black')

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
    })) : [],
    lyricsLayouts ? lyricsLayouts.map(layout => {
      return el.push(elements, 'lyrics').create('text', {
        ...layout.cxby, style: getStyle({ ...layout, anchor: 'middle' })
      }, layout.text)
    }) : []
  ])
}
