import { el } from '../utils/html'

export default function box(layout, color) {
  const style = `
    stroke-width: 0.6
    stroke: ${color || 'red'}
    stroke-dasharray: 2 1
    stroke-opacity: 0.6
    fill: none
  `

  return el('rect', { ...layout.rect, style })
}
