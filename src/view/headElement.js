import { el } from '../utils/html'
import box from './box'

export default function headElement(headLayout) {
  const { titleLayout, subtitleLayout } = headLayout
  const { title, subtitle, composer, lyricist, arranger } = headLayout.head

  const sty1 = `
    font-family: ${titleLayout.family}
    font-size: ${titleLayout.size}
    text-anchor: middle
  `
  const sty2 = `
    font-family: ${subtitleLayout.family}
    font-size: ${subtitleLayout.size}
    text-anchor: middle
  `

  return el.create('g', [
    // box(noteLayout, 'green'),
    title ? el('text', { ...titleLayout.cxby, style: sty1 }, title) : [],
    subtitle ? el('text', { ...subtitleLayout.cxby, style: sty2 }, subtitle) : []
  ])
}
