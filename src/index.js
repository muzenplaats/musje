import Cell from './model/Cell'
import Staff from './model/Staff'
import player from './player/player'
import { el, Element } from './utils/html'
import { loadText } from './utils/html'

// import './test/testModel'
// import './test/testXml'

import Style from './utils/Style'
import defaultStyle from './layout/default.style'
const style = new Style(defaultStyle).value

import Time from './model/Time'
import TimeLayout from './layout/TimeLayout'
import timeElement from './view/timeElement'

import Pitch from './model/Pitch'
import PitchLayout from './layout/PitchLayout'
import pitchElement from './view/pitchElement'

import Bar from './model/Bar'
import BarLayout from './layout/BarLayout'
import barElement from './view/barElement'

import Duration from './model/Duration'
import DurationLayout from './layout/DurationLayout'
import durationElement from './view/durationElement'

import Note from './model/Note'
import NoteLayout from './layout/NoteLayout'
import noteElement from './view/noteElement'

import Rest from './model/Rest'
import RestLayout from './layout/RestLayout'
import restElement from './view/restElement'

import Chord from './model/Chord'
import ChordLayout from './layout/ChordLayout'
import chordElement from './view/chordElement'

const logJSON = obj => console.log(JSON.parse(JSON.stringify(obj, null, 2)))

const y2 = 100

const time = new Time('23/4')
const timeLayout = new TimeLayout(time, style)
timeLayout.position = { x: 50, y2 }
// logJSON(timeLayout)

const pitch = new Pitch(`b5'''`)
const pitchLayout = new PitchLayout(pitch, style)
pitchLayout.position = { x: 100, y2 }
// logJSON(pitchLayout)

const bar = new Bar('|]')
const barLayout = new BarLayout(bar, style)
barLayout.position = { x: 150, y2 }
// logJSON(barLayout)

const duration = new Duration('=..')
const durationLayout = new DurationLayout(duration, style)
durationLayout.position = { x: 200, y2 }
// logJSON(durationLayout)

const note = new Note('n6,=.')
const noteLayout = new NoteLayout(note, style)
noteLayout.position = { x: 250, y2 }
// logJSON(noteLayout)

const rest = new Rest('0=_.')
const restLayout = new RestLayout(rest, style)
restLayout.position = { x: 300, y2 }
// logJSON(restLayout)

const chord = new Chord('<1,#3,5,>=..')
const chordLayout = new ChordLayout(chord, style)
chordLayout.position = { x: 350, y2 }
logJSON(chordLayout)

function component() {
  let editor, info, staff, cell
  const editorChange = () => {
    staff = new Staff(editor.value)
    info.innerHTML = staff + '\n' + JSON.stringify(staff, null, 2)
    cell = staff.cells[0]
  }

  const main = new Element(el('div', { style: 'width: 90%; margin: 15px' }, [
    el('h1', { style: 'font-size: 26px' }, 'Musje 123'),
    el('div', { style: 'width: 47%; float: left'}, [
      el('textarea', {
        style: 'width: 100%; height: 100px',
        keyup: editorChange
      }),
      el('button', { click: () => player.play(cell) }, '>'),
      el('button', { click: () => player.pause() }, '||'),
      el('button', { click: () => player.stop() }, '[]'),
      el('pre', { style: 'width: 100%; white-space: pre-wrap' }),
    ]),
    el('div', { style: 'width: 47%; float: left; padding-left: 30px'}, [
      el('svg', { width: 500, height: 200 }, [
        el('rect', { x: 0, y: 0, width: 500, height: 200,
                     style: 'fill: none; stroke-width: 1; stroke: black' }),
        timeElement(timeLayout),
        pitchElement(pitchLayout),
        barElement(barLayout),
        durationElement(durationLayout),
        noteElement(noteLayout),
        restElement(restLayout),
        chordElement(chordLayout)
      ])
    ])
  ])).create()
  editor = main.querySelector('textarea')
  info = main.querySelector('pre')

  loadText('scores/001.musje', txt => { editor.value = txt; editorChange() })

  return main
}

document.body.appendChild(component())
