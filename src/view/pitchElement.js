import { el } from '../utils/html'
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

  const stepElement = el.create('text', {
    ...stepLayout.cxby, style: sty1
  }, pitch.step)

  const accidentalElement = pitch.accidental ? el.create('text', {
    ...accidentalLayout.cxby, style: sty2
  }, accidentalLayout.char) : []

  const octaveElements = pitch.octave ? octavesLayout.layouts.map(layout => {
    return el.create('circle', layout.circle)
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

  return el.create('g', [
    // box(stepLayout, 'magenta'),
    stepElement,
    accidentalElement,
    octaveElements
  ])
}
