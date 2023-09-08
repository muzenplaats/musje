import el from '../utils/el'
import box from './box'

export default function directionElement(directionLayout) {
  const { direction, textLayout } = directionLayout
  const { words, dynamics } = direction

  const getStyle = ({ family, size }) => {
    return `
      font-family: ${family}
      font-size: ${size}
    `
  }

  return el.create('g', [
    // box(directionLayout, 'green'),

    textLayout ? el('text', {
      ...textLayout.xby, style: getStyle(textLayout)
    }, words || dynamics) : []
  ])
}
