import Pitch from './model/Pitch'
import Duration from './model/Duration'
import Note from './model/Note'
import Rest from './model/Rest'
import Chord from './model/Chord'
import { play } from './player/player'

const p = new Pitch({ step: 6, octave: 0, accidental: '' })
p.alter = 0
console.log(p.toJSON(), '' + p, p.midiNumber, p.frequency)
const p2 = new Pitch('#3,')
console.log(p2.toJSON(), '' + p2)
const d = new Duration('=_..')
console.log(d.toJSON(), '' + d)
const n = new Note(`b5''---.`)
console.log(n.toJSON(), '' + n)
const r = new Rest('0-..')
console.log(r.toJSON(), '' + r)
const c = new Chord(`<1#351'>_`)
console.log(c.toJSON(), '' + c)

function component() {
  const div = document.createElement('div')
  const btn = document.createElement('button')
  btn.innerHTML = '&gt;'
  btn.addEventListener('click', () => play(p.frequency), false);
  div.appendChild(btn)
  return div;
}

document.body.appendChild(component())
