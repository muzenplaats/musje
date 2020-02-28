import Cell from './model/Cell'
import player from './player/player'
import { el, Element } from './utils/html'
import { load } from './utils/helpers'

// import './test/testModel'
// import './test/testXml'

function component() {
  let editor, info, cell
  const editorChange = () => {
    cell = new Cell(editor.value)
    info.innerHTML = cell + '\ncell = ' + JSON.stringify(cell, null, 2)
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
        el('circle', { cx: 20, cy: 20, r: 10}),
        el('text', { x: 20, y: 50 }, '5')
      ])
    ])
  ])).create()
  editor = main.querySelector('textarea')
  info = main.querySelector('pre')

  load('scores/001.musje', txt => { editor.value = txt; editorChange() })

  return main
}

document.body.appendChild(component())
