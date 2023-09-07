import Score from './model/Score'
// import ScoreLayout from './layout/ScoreLayout'
// import scoreElement from './view/scoreElement'
import el from './utils/el'
import { loadText } from './utils/helpers'

import './appElement.css'

// import './test/testLexer'

// import jsonElement from './utils/jsonElement'
// import xmlElement from './utils/xmlElement'


const defaultUrl = 'scores/016.musje'

const scoresUrls = (function () {
  const fnames = [
    '001', '002', '003', '004', '005', '006', '007', '008', '009', '010',
    '011', '012', '013', '014', '015', '016', '017', '018', '019', '020',
   '021', '022', '023', '024', '025', '026', '027', '028', '029', '030', 
   '031', '032'
  ]

  return fnames.map(fname => `scores/${fname}.musje`)
}())


export default function appElement() {
  const data = el.setData({
    url: '',
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

        // Tmp
        score.addStyle(`
          score {
            width: 800px
          }
        `)

        return score
      }
    },

    // scoreLayout: { get() { return new ScoreLayout(this.score) } },

    info: { get() { return this.score } },
    error: '',
    scoreElement: { el() { return this.score.render() } },

    // scoreJsonElement: { el() { return jsonElement('score', this.score) } },
    // scoreLayoutJsonElement: {
    //   el() { return jsonElement('scoreLayout', this.scoreLayout) }
    // }
  })

  const loadScore = url => {
    data.url = url
    loadText(url, txt => { data.scoreStr = txt })
  }

  const main = el.create('div', { style: 'width: 90%; margin: 15px' }, [
    el('h1', { style: 'font-size: 26px' }, 'Musje 123'),

    el('div', { style: 'width: 47%; float: left'}, [
      el('textarea', {
        style: 'width: 100%; height: 300px',
        value: data.$scoreStr
      }),

      el('span', scoresUrls.map((url, i) => {
        return el('button', { click() { loadScore(url); data.url = url } }, i + 1)
      })), ' ',

      el('button', { click: () => data.score.play() }, '>'),
      el('button', { click: () => data.score.pause() }, '||'),
      el('button', { click: () => data.score.stop() }, '[]'),
      el('span', { style: 'padding: 3px; color: gray;' }, data.$url),

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

  loadScore(defaultUrl)

  return main
}
