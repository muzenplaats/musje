import Cell from './model/Cell'
import Staff from './model/Staff'
import player from './player/player'
import { el, Element } from './utils/html'
import { loadText } from './utils/html'

// import './test/testModel'
// import './test/testXml'

import Time from './model/Time'
import Style from './layout/Style'
import defaultStyle from './layout/default.style'
import TimeLayout from './layout/TimeLayout'
import timeElement from './view/timeElement'

const time = new Time('23/4')
const style = new Style(defaultStyle).value
const timeLayout = new TimeLayout(time, style)
timeLayout.position = { x: 50, y: 50 }
const logJSON = obj => console.log(JSON.parse(JSON.stringify(obj, null, 2)))
logJSON(timeLayout)

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
      el('button', { click: () => player.play(cell) }, '&gt;'),
      el('button', { click: () => player.pause() }, '||'),
      el('button', { click: () => player.stop() }, '[]'),
      el('pre', { style: 'width: 100%; white-space: pre-wrap' }),
    ]),
    el('div', { style: 'width: 47%; float: left; padding-left: 30px'}, [
      el('svg', { width: 500, height: 200 }, [
        el('rect', { x: 0, y: 0, width: 500, height: 200,
                     style: 'fill: none; stroke-width: 1; stroke: black' }),
        timeElement(timeLayout)
      ])
    ])
  ])).create()
  editor = main.querySelector('textarea')
  info = main.querySelector('pre')

  loadText('scores/001.musje', txt => { editor.value = txt; editorChange() })

  return main
}

document.body.appendChild(component())
