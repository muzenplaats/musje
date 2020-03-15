import Score from './model/Score'
import ScoreLayout from './layout/ScoreLayout'
import scoreElement from './view/scoreElement'
import player from './player/player'
import { el } from './utils/html'
import { loadText } from './utils/html'
import Style from './utils/Style'
import defaultStyle from './layout/default.style'
const style = new Style(defaultStyle).value
import box from './view/box'

// import './test/testModel'
// import './test/testXml'
// import testElement from './test/testElement'

import CellLayout from './layout/CellLayout'
import cellElement from './view/cellElement'

import jsonElement from './utils/jsonElement'
import xmlElement from './utils/xmlElement'


function component() {
  let editor, svg, cell
  const cellElements = []

  const data = el.setData({
    info: ''
  })

  const renderCell = (cell, i, y2) => {
    const cellLayout = new CellLayout(cell, style)
    cellLayout.position = { x: 50, y2 }
    updateCells[i](cellElement(cellLayout, style))
  }

  const editorChange = () => {
    try {
      const score = new Score(editor.value)
      data.info = score

      const scoreLayout = new ScoreLayout(score, style)
      scoreLayout.position = { x: 0, y: 0 }
      // updateScore(scoreElement(scoreLayout))

      const staff = score.body.parts[0].staves[0]
      cell = staff.cells[0]
      // updateJson(jsonElement('score', score))
      updateJson1(jsonElement('score', score))
      updateJson2(jsonElement('scoreLayout', scoreLayout))
      renderCell(cell, 0, 70)
      // renderCell(staff.cells[1], 1, 110)
      // renderCell(staff.cells[2], 2, 150)
    } catch (e) {
      data.info = e
    }
  }

  const main = el.create('div', { style: 'width: 90%; margin: 15px' }, [
    el('h1', { style: 'font-size: 26px' }, 'Musje 123'),
    el('div', { style: 'width: 47%; float: left'}, [
      el('textarea', {
        style: 'width: 100%; height: 100px',
        keyup: editorChange
      }),
      el('button', { click: () => player.play(cell) }, '>'),
      el('button', { click: () => player.pause() }, '||'),
      el('button', { click: () => player.stop() }, '[]'),
      el('pre', { style: 'width: 100%; white-space: pre-wrap' }, data.$info),
      el('div', { id: 'json1' })
    ]),
    el('div', { style: 'width: 47%; float: left; padding-left: 30px'}, [
      el('div', { id: 'score' }),
      el('svg', { width: 500, height: 200 }, [
        box({ rect: { x: 0, y: 0, width: 500, height: 200 } }, 'black'),
        // testElement()
      ]),
      el('div', { id: 'xml' }),
      el('div', { id: 'json2' })
    ])
  ])

  editor = main.querySelector('textarea')
  svg = main.querySelector('svg')
  const updateJson1 = el.makeUpdate(main, '#json1')
  const updateJson2 = el.makeUpdate(main, '#json2')
  const updateXml = el.makeUpdate(main, '#xml')
  const updateScore = el.makeUpdate(main, '#score')

  const updateCells = [
    el.makeUpdate(svg), el.makeUpdate(svg), el.makeUpdate(svg)
  ]

  loadText('scores/002.musje', txt => {
    editor.value = txt; editorChange()
  })

  const mxlfnames = [
    'reve.musicxml',
    'helloworld.musicxml',
    'Reunion.musicxml'
  ]

  loadText('scores/musicXml/' + mxlfnames[2], txt => {
    // updateXml(xmlElement(txt))
  })

  return main
}

document.body.appendChild(component())
