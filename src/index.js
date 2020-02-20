import Pitch from './model/Pitch'
import Duration from './model/Duration'
import Time from './model/Time'
import Note from './model/Note'
import Rest from './model/Rest'
import Chord from './model/Chord'
import Direction from './model/Direction'
import Multipart from './model/Multipart'
import Bar from './model/Bar'
import Cell from './model/Cell'
import Staff from './model/Staff'
import player from './player/player'

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
test(Multipart, '<1- #1 | 12 3>')
test(Direction, '/test', '\\測試')
test(Bar, '|', '||', ':|', '|:', ':|:', '|]')
test(Cell, { data: [new Time('6/8'), new Note('5'), new Rest('0'),
                    new Chord(`<572'>`), new Bar('||')] },
           '2/4 7,1 0   <246>_ <1 1|2 > \\be \n 1 /ab  | 2 ')
test(Staff, '2/4 1 1 | 5  <15> | 6  \n 6 | 5- ')

const value = `1155665- 4433221- 5544332- 5544332- 1155665-
1 <13> <135> <1357> <13571'> <1357> <135> <13> 1`
const cell = new Cell(value)

function component() {
  const div = document.createElement('div')
  const editor = document.createElement('textarea')
  editor.value = value

  const btnRefrash = document.createElement('button')
  btnRefrash.innerHTML = '()'
  btnRefrash.addEventListener('click', () => {}, false)

  const btnPlay = document.createElement('button')
  btnPlay.innerHTML = '&gt;'
  btnPlay.addEventListener('click', () => player.play(cell), false)

  const btnStop = document.createElement('button')
  btnStop.innerHTML = '[]'
  btnStop.addEventListener('click', () => player.stop(), false)

  const info = document.createElement('pre')
  info.innerHTML = cell

  div.appendChild(editor)
  div.appendChild(btnRefrash)
  div.appendChild(btnPlay)
  div.appendChild(btnStop)
  div.appendChild(info)
  return div;
}

document.body.appendChild(component())
