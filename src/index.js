import Pitch from './model/Pitch'
import Duration from './model/Duration'
import Time from './model/Time'
import Note from './model/Note'
import Rest from './model/Rest'
import Chord from './model/Chord'
import Bar from './model/Bar'
import Cell from './model/Cell'
import Staff from './model/Staff'
import { play } from './player/player'

const { slice } = []
function test() {
  const list = slice.apply(arguments)
  const Class = list.shift()
  list.forEach(item => {
    const inst = new Class(item)
    console.log(JSON.parse(JSON.stringify(inst)), '' + inst)
  })
}

test(Time, '3/4')
test(Pitch, { step: 6, octave: 0, accidental: '' }, '#3,')
test(Duration, '=_..')
test(Note, `b5''---.`)
test(Rest, '0-..')
test(Chord, `<1#351'>_`)
test(Bar, '|', '||', ':|', '|:', ':|:', '|]')
test(Cell, { data: [new Time('6/8'), new Note('5'), new Rest('0'),
                    new Chord(`<572'>`), new Bar('||')] },
           '2/4 7,1 0   <246>_ \n | 2')
test(Staff, '2/4 1 1 | 5  <15> | 6  \n 6 | 5- ')

function component() {
  const div = document.createElement('div')
  const btn = document.createElement('button')
  btn.innerHTML = '&gt;'
  btn.addEventListener('click', () => play(p.frequency), false);
  div.appendChild(btn)
  return div;
}

document.body.appendChild(component())
