import Style from '../utils/Style'
import defaultStyle from '../layout/default.style'
const style = new Style(defaultStyle).value

import Time from '../model/Time'
import TimeLayout from '../layout/TimeLayout'
import timeElement from '../view/timeElement'

import Pitch from '../model/Pitch'
import PitchLayout from '../layout/PitchLayout'
import pitchElement from '../view/pitchElement'

import Bar from '../model/Bar'
import BarLayout from '../layout/BarLayout'
import barElement from '../view/barElement'

import Duration from '../model/Duration'
import DurationLayout from '../layout/DurationLayout'
import durationElement from '../view/durationElement'

import Note from '../model/Note'
import NoteLayout from '../layout/NoteLayout'
import noteElement from '../view/noteElement'

import Rest from '../model/Rest'
import RestLayout from '../layout/RestLayout'
import restElement from '../view/restElement'

import Chord from '../model/Chord'
import ChordLayout from '../layout/ChordLayout'
import chordElement from '../view/chordElement'

import Cell from '../model/Cell'
import CellLayout from '../layout/CellLayout'
import cellElement from '../view/cellElement'

import Head from '../model/Head'
import HeadLayout from '../layout/HeadLayout'
import headElement from '../view/headElement'

// import Score from '../model/Score'
// import ScoreLayout from '../layout/ScoreLayout'
// import scoreElement from '../view/scoreElement'

const logJSON = obj => console.log(JSON.parse(JSON.stringify(obj, null, 2)))

const y2 = 90

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
// logJSON(chordLayout)

const cell = new Cell('6/8 1,_ 5, 2. 7-.  0 <1,#3,5,>=..')
const cellLayout = new CellLayout(cell, style)
cellLayout.position = { x: 50, y2: 180 }
// logJSON(cellLayout)

const head = new Head('title: The Title\nsubtitle: The Subtitle')
const headLayout = new HeadLayout(head, style)
headLayout.position = { x: 50, y: 50 }
logJSON(headLayout)

import { el, Element } from '../utils/html'
export default function testElement() {
  const main = new Element(el('g', [
    // timeElement(timeLayout),
    // pitchElement(pitchLayout),
    // barElement(barLayout),
    // durationElement(durationLayout),
    // noteElement(noteLayout),
    // restElement(restLayout),
    // chordElement(chordLayout),
    // cellElement(cellLayout),
    headElement(headLayout)
  ])).create()

  return main
}

