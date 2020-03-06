import { el, Element } from '../utils/html'
import box from './box'

export default function pitchElement(pitchLayout) {
  const { pitch, stepLayout, accidentalLayout, octavesLayout } = pitchLayout
  const sty1 = `font-family: ${stepLayout.family}
                font-size: ${stepLayout.size}
                text-anchor: middle`
  const sty2 = `font-family: ${accidentalLayout.family}
                font-size: ${accidentalLayout.size}
                text-anchor: middle`

  const main = new Element(el('g', [
    // box(stepLayout, 'magenta'),
    el('text', { ...stepLayout.cxby, style: sty1 }, pitch.step),
    pitch.accidental ? el('text', {
      ...accidentalLayout.cxby, style: sty2
    }, accidentalLayout.char) : [],
    pitch.octave ? octavesLayout.layouts.map(layout => {
      return el('circle', layout.circle)
    }) : []
  ])).create()

  return main
}
