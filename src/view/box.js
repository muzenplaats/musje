import { el } from '../utils/html'

export default function box(layout, color) {
  const style = `
    stroke-width: 0.8
    stroke: ${color || 'red'}
    stroke-dasharray: 2 1
    stroke-opacity: 0.8
    fill: none
  `

  return el('rect', { ...layout.rect, style })
}
