import Score from './model/Score'
import ScoreLayout from './layout/ScoreLayout'
import scoreElement from './view/scoreElement'
import player from './player/player'
import el from './utils/el'
import { loadText } from './utils/helpers'
import Style from './utils/Style'
import defaultStyle from './layout/default.style'
const style = new Style(defaultStyle).value
import box from './view/box'
import './appElement.css'

// import './test/testModel'
// import './test/testXml'
// import testElement from './test/testElement'

import CellLayout from './layout/CellLayout'
import cellElement from './view/cellElement'

import jsonElement from './utils/jsonElement'
import xmlElement from './utils/xmlElement'


export default function appElement() {

  const getCellElement = (cell, x, y2) => {
    if (!cell) return el.create('g')
    const cellLayout = new CellLayout(cell, style)
    cellLayout.position = { x, y2 }
    return cellElement(cellLayout)
  }

  const data = el.setData({
    scoreStr: '',
    score: {
      get() {
        let score
        try {
          score = new Score(this.scoreStr)
          this.error = ''
        } catch (e) {
          score = new Score()
          this.error = e
        }
        return score
      }
    },
    scoreLayout: {
      get() { return new ScoreLayout(this.score, style) }
    },
    info: { get() { return this.score } },
    error: '',
    scoreElement: {
      el() { return el.create('div'); return scoreElement(this.scoreLayout) }
    },

    // tmp =======================================================
    staff: {
      get() {
        const { parts } = this.score.body
        return parts.length ? parts[0].staves[0] : null
      }
    },
    cell: {
      get() { return this.staff ? this.staff.cells[0] : null }
    },
    cellElement1: {
      el() {
        if (!this.staff || !this.staff.cells[0]) return el.create('g')
        const cell = this.score.body.parts[0].staves[0].cells[0]
        return getCellElement(cell, 20, 70)
      }
    },
    cellElement2: {
      el() {
        if (!this.staff || !this.staff.cells[1]) return el.create('g')
        return getCellElement(this.staff.cells[1], 20, 90)
      }
    },
    cellElement3: {
      el() {
        if (!this.staff || !this.staff.cells[2]) return el.create('g')
        return getCellElement(this.staff.cells[2], 20, 110)
      }
    },
    // tmp =======================================================

    scoreJsonElement: { el() { return jsonElement('score', this.score) } },
    scoreLayoutJsonElement: {
      el() { return jsonElement('scoreLayout', this.scoreLayout) }
    },
    musicXmlStr: '<wait/>',
    musicXmlElement: { el() { return xmlElement(this.musicXmlStr) } }
  })

  const main = el.create('div', { style: 'width: 90%; margin: 15px' }, [
    el('h1', { style: 'font-size: 26px' }, 'Musje 123'),
    el('div', { style: 'width: 47%; float: left'}, [
      el('textarea', {
        style: 'width: 100%; height: 100px',
        value: data.$scoreStr
      }),
      el('button', { click: () => player.play(data.cell) }, '>'),
      el('button', { click: () => player.pause() }, '||'),
      el('button', { click: () => player.stop() }, '[]'),
      el('pre', { style: 'color: #d53' }, data.$error),
      el('pre', { style: 'width: 100%; white-space: pre-wrap' },
                data.$info),
      el('div', data.$scoreJsonElement)
    ]),
    el('div', { style: 'width: 47%; float: left; padding-left: 30px'}, [
      el('div', data.$scoreElement),
      el('svg', { id: 'svg', width: 500, height: 200 }, [
        box({ rect: { x: 0, y: 0, width: 500, height: 200 } }, 'black'),
        el('g', data.$cellElement1),
        el('g', data.$cellElement2),
        el('g', data.$cellElement3),
        // testElement()
      ]),
      el('div', data.$musicXmlElement),
      el('div', data.$scoreLayoutJsonElement)
    ])
  ])

  loadText('scores/002.musje', txt => { data.scoreStr = txt })

  const mxlfnames = [
    'reve.musicxml',
    'helloworld.musicxml',
    'Reunion.musicxml'
  ]

  loadText('scores/musicXml/' + mxlfnames[2], txt => {
    data.musicXmlStr = txt
  })

  return main
}
