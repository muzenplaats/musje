import Pitch from './model/Pitch'
import { play } from './player/player'

const p = new Pitch({ step: 6, octave: 0, accidental: '' })
p.alter = 0
console.log(p.toJSON(), '' + p, p.midiNumber, p.frequency)

function component() {
  const div = document.createElement('div')
  const btn = document.createElement('button')
  btn.innerHTML = '&gt;'
  btn.addEventListener('click', () => play(p.frequency), false);
  div.appendChild(btn)
  return div;
}

document.body.appendChild(component())
