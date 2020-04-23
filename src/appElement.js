import Score from './model/Score'
import ScoreLayout from './layout/ScoreLayout'
import scoreElement from './view/scoreElement'
import player from './player/player'
import el from './utils/el'
import { loadText } from './utils/helpers'

import Style from './utils/Style'
import defaultStyle from './layout/default.style'
const style = new Style(defaultStyle).value
import './appElement.css'

import jsonElement from './utils/jsonElement'
import xmlElement from './utils/xmlElement'

export default function appElement() {
  const data = el.setData({
    scoreStr: '',
    score: {
      get() {
        // return new Score(this.scoreStr)
        let score
        try {
          score = new Score(this.scoreStr); this.error = ''
          // console.log('score', score)
        } catch (e) {
          score = new Score(); this.error = e //.stack
        }
        return score
      }
    },
    scoreLayout: { get() { return new ScoreLayout(this.score, style) } },
    info: { get() { return this.score } },
    error: '',
    scoreElement: { el() { return scoreElement(this.scoreLayout) } },
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
      el('button', { click: () => player.play(data.score) }, '>'),
      el('button', { click: () => player.pause() }, '||'),
      el('button', { click: () => player.stop() }, '[]'),
      el('pre', { style: 'color: #d53' }, data.$error),
      el('pre', {
        style: 'border: 1px solid #ccc; padding: 5px; width: 100%; background-color: #eee; white-space: pre-wrap'
      }, data.$info),
      // el('div', data.$scoreJsonElement)
    ]),

    el('div', { style: 'width: 47%; float: left; padding-left: 30px'}, [
      el('div', data.$scoreElement),
      // el('div', data.$scoreLayoutJsonElement)
    ])
  ])

  loadText('scores/011.musje', txt => { data.scoreStr = txt })

  return main
}
