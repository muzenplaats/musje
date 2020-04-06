import el from '../utils/el'
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

  const elements = {}

  const setColor = color => {
    elements.step.style.fill = color
    if (pitch.accidental) elements.accidental.style.fill = color
    if (pitch.octave) {
      elements.octaves.forEach(element => { element.style.fill = color })
    }
  }

  pitch.onplay = () => setColor('#b5c')
  pitch.onstop = () => setColor('black')

  return el.create('g', [
    // box(stepLayout, 'magenta'),
    el.assign(elements, 'step')
      .create('text', { ...stepLayout.cxby, style: sty1 }, pitch.step),
    pitch.accidental ?
      el.assign(elements, 'accidental')
        .create('text', { ...accidentalLayout.cxby, style: sty2 }, accidentalLayout.char) : [],
    pitch.octave ? octavesLayout.layouts.map(layout => {
      return el.push(elements, 'octaves')
               .create('circle', layout.circle)
    }) : []
  ])
}
