import Cell from './model/Cell'
import Staff from './model/Staff'
import player from './player/player'
import { el, Element } from './utils/html'
import { loadText } from './utils/html'

// import './test/testModel'
// import './test/testXml'
import testElement from './test/testElement'

import Style from './utils/Style'
import defaultStyle from './layout/default.style'
const style = new Style(defaultStyle).value

import CellLayout from './layout/CellLayout'
import cellElement from './view/cellElement'

function component() {
  let editor, info, svg, staff, cell
  const cellElements = []

  const renderCell = (cell, i, y2) => {
    const cellLayout = new CellLayout(cell, style)
    cellLayout.position = { x: 50, y2 }
    if (cellElements[i] && cellElements[i].parentNode) {
      cellElements[i].parentNode.removeChild(cellElements[i])
    }
    cellElements[i] = cellElement(cellLayout, style)
    svg.appendChild(cellElements[i])
  }

  const editorChange = () => {
    try {
      staff = new Staff(editor.value)
      info.textContent = staff + '\n' + JSON.stringify(staff, null, 2)
      cell = staff.cells[0]
      renderCell(cell, 0, 70)
      renderCell(staff.cells[1], 1, 110)
      renderCell(staff.cells[2], 2, 150)
    } catch (e) {
      info.textContent = e
    }
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
        testElement()
      ])
    ])
  ])).create()
  editor = main.querySelector('textarea')
  info = main.querySelector('pre')
  svg = main.querySelector('svg')

  // loadText('scores/002.musje', txt => { editor.value = txt; editorChange() })

  return main
}

document.body.appendChild(component())
