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

import jsonElement from './utils/jsonElement'
import xmlElement from './utils/xmlElement'

import mxlStr from '../dist/scores/musicXml/reve.musicxml'
// import mxlStr from '../dist/scores/musicXmlStr/helloworld.musicxml'
// import mxlStr from '../dist/scores/musicXmlStr/Reunion.musicXml'

export default function fromMxlElement() {
  const data = el.setData({
    score: {
      get() {
        // console.log('get fromMxl')
        return Score.fromMxl(mxlStr)
        let score
        try {
          score = Score.fromMxl(mxlStr); this.error = ''
        } catch (e) {
          score = new Score(); this.error = e
        }
        return score
      }
    },
    scoreStr: { get() { return '' + this.score } },
    // scoreLayout: { get() { return new ScoreLayout(this.score, style) } },
    info: { get() { return this.scoreStr } },
    error: '',
    // scoreElement: {
    //   el() { return el.create('div'); return scoreElement(this.scoreLayout) }
    // },
    // scoreJsonElement: { el() { return jsonElement('score', this.score) } },
    // scoreLayoutJsonElement: {
    //   el() { return jsonElement('scoreLayout', this.scoreLayout) }
    // }
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
      // el('div', data.$scoreJsonElement)
    ]),

    el('div', { style: 'width: 47%; float: left; padding-left: 30px'}, [
      el('div', data.$scoreElement),
      el('svg', { id: 'svg', width: 500, height: 200 }, [
        box({ rect: { x: 0, y: 0, width: 500, height: 200 } }, 'black'),

      ]),
      // el('div', data.$scoreLayoutJsonElement)
    ])
  ])

  return main
}
