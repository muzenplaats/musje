import { el, Element } from '../utils/html'
import box from './box'

export default function pitchElement(pitchLayout) {
  const { pitch, stepLayout, accidentalLayout, octavesLayout } = pitchLayout
  const sty1 = `
    font-family: ${stepLayout.family}
    font-size: ${stepLayout.size}
    text-anchor: middle
  `
  const sty2 = `
    font-family: ${accidentalLayout.family}
    font-size: ${accidentalLayout.size}
    text-anchor: middle
  `

  const stepElement = new Element(el('text', {
    ...stepLayout.cxby, style: sty1
  }, pitch.step)).create()

  const accidentalElement = pitch.accidental ? new Element(el('text', {
    ...accidentalLayout.cxby, style: sty2
  }, accidentalLayout.char)).create() : []

  const octaveElements = pitch.octave ? octavesLayout.layouts.map(layout => {
    return new Element(el('circle', layout.circle)).create()
  }) : []

  const setColor = color => {
    stepElement.style.fill = color
    if (pitch.accidental) accidentalElement.style.fill = color
    if (pitch.octave) {
      octaveElements.forEach(element => { element.style.fill = color })
    }
  }

  pitch.onplay = () => setColor('#b5c')
  pitch.onstop = () => setColor('black')

  // setTimeout(() => setColor('#b5c'), 3000)

  const main = new Element(el('g', [
    // box(stepLayout, 'magenta'),
    stepElement,
    accidentalElement,
    octaveElements
  ])).create()


  return main
}
