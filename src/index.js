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

import Score from './model/Score'
// import ScoreLayout from './layout/ScoreLayout'
// import scoreElement from './view/scoreElement'
// const logJSON = obj => console.log(JSON.parse(JSON.stringify(obj, null, 2)))
// const score = new Score(`
// title: the title
// subtitle: the subtitle
// composer: the composer
// 1 2. 3.. 4_ 5_. 6_.. 7= 0=
// 1'- #1'-. b1'-.. #2--- n2---.
// `)
// const scoreLayout = new ScoreLayout(score, style)
// scoreLayout.position = { x: 0, y: 0 }
// logJSON(scoreLayout)

import CellLayout from './layout/CellLayout'
import cellElement from './view/cellElement'

import jsonElement from './utils/jsonElement'

function component() {
  let editor, info, svg, json, score, staff, cell
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
    // try {
      score = new Score(editor.value)
      staff = new Staff(editor.value)
      info.textContent = score + '\n' + JSON.stringify(score, null, 2)
      cell = staff.cells[0]
      json.appendChild(jsonElement('score', score))
      // renderCell(cell, 0, 70)
      // renderCell(staff.cells[1], 1, 110)
      // renderCell(staff.cells[2], 2, 150)
    // } catch (e) {
    //   info.textContent = e
    // }
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
      // scoreElement(scoreLayout),
      el('svg', { width: 500, height: 200 }, [
        el('rect', { x: 0, y: 0, width: 500, height: 200,
                     style: 'fill: none; stroke-width: 1; stroke: black' }),
        testElement()
      ]),
      el('div', { id: 'json' })
    ])
  ])).create()

  editor = main.querySelector('textarea')
  info = main.querySelector('pre')
  svg = main.querySelector('svg')
  json = main.querySelector('#json')

  loadText('scores/002.musje', txt => { editor.value = txt; editorChange() })

  return main
}

document.body.appendChild(component())
