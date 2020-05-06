import el from '../utils/el'
import pitchElement from './pitchElement'
import durationElement from './durationElement'
import curveElement from './curveElement'
import tupletElement from './tupletElement'
import box from './box'
import { flatten } from '../utils/helpers'

export default function chordElement(chordLayout) {
  const { chord, pitchesLayout, durationLayout,
          tieLayout, tupletLayout,
          beginSlursLayouts, endSlursLayouts, lyricsLayouts } = chordLayout

  const showTie = tieLayout => {
    if (!tieLayout) return false
    const { tie } =  tieLayout
    return tie.type !== 'end' || tieLayout.showPrev
  }

  const showTuplet = tupletLayout =>
                     tupletLayout && tupletLayout.tuplet.type === 'begin'

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

  // chord.onplay = () => setColor('#b5c')
  chord.onplay = () => setColor('orange')
  chord.onstop = () => setColor('black')

  return el.create('g', [
    // box(chordLayout, 'green'),
    pitchesLayout.layouts.map(layout => pitchElement(layout)),
    durationElement(durationLayout),

    showTie(tieLayout) ? curveElement(tieLayout) : [],
    showTuplet(tupletLayout) ? tupletElement(tupletLayout) : [],
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
