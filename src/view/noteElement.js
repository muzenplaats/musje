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
    text-anchor: ${anchor || 'begin'}
  `

  const elements = {}

  const setColor = color => {
    const { lyrics, hyphens } =  elements
    if (lyrics) lyrics.forEach(element => element.style.fill = color)
    if (hyphens) hyphens.forEach(element => element.style.fill = color)
  }

  // note.onplay = () => setColor('#b5c')
  note.onplay = () => setColor('orange')
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
    }) : [],

    // Hyphen of lyrics
    lyricsLayouts ? flatten(lyricsLayouts.map(layout => {
      const { lyric } = layout
      if (!lyric.next) return []
      const { x2, by: y } = layout
      if (lyric.layout.sys !== lyric.next.layout.sys) {
        return el.push(elements, 'hyphens').create('text', {
          x: x2 + 2, y, style: getStyle(layout)
        }, '-')
      }
      const nlayout = lyric.next.layout
      if (!nlayout) return
      const nx = nlayout.x
      return el.push(elements, 'hyphens').create('text', {
        x: (x2 + nx) / 2, y,
        style: getStyle({ ...layout, anchor: 'middle' })
      }, '-')
    })) : []
  ])
}
