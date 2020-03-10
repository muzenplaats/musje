import { el } from '../utils/html'
import box from './box'

export default function headElement(headLayout) {
  const { titleLayout, subtitleLayout, composerLayout, arrangerLayout } = headLayout
  const { title, subtitle, composer, lyricist, arranger } = headLayout.head

  const getStyle = ({ family, size, anchor }) => `
    font-family: ${family}
    font-size: ${size}
    text-anchor: ${anchor}
  `

  return el.create('g', [
    box(headLayout, 'green'),
    title ? el('text', {
      ...titleLayout.cxby,
      style: getStyle({ ...titleLayout, anchor: 'middle' })
    }, title) : [],
    subtitle ? el('text', {
      ...subtitleLayout.cxby,
      style: getStyle({ ...subtitleLayout, anchor: 'middle'})
    }, subtitle) : [],
    composer ? el('text', {
      ...composerLayout.x2by,
      style: getStyle({ ...subtitleLayout, anchor: 'end' })
    }, composer) : []
  ])
}
