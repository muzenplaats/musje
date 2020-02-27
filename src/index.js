import Pitch from './model/Pitch'
import Duration from './model/Duration'
import Time from './model/Time'
import Note from './model/Note'
import Rest from './model/Rest'
import Chord from './model/Chord'
import Direction from './model/Direction'
import Multipart from './model/Multipart'
import Bar from './model/Bar'
import Cell from './model/Cell'
import Staff from './model/Staff'
import player from './player/player'
// import Document, { XmlDecl, Doctype, Comment, Attrs, Element, el } from './utils/XmlDocument'
import { el, Element } from './utils/html'
import { load } from './utils/helpers'

const { slice } = []
function test() {
  const list = slice.apply(arguments)
  const Class = list.shift()
  list.forEach(item => {
    const inst = new Class(item)
    console.log(JSON.parse(JSON.stringify(inst)), '' + inst)
  })
}

// ----------------------------------------------------------------
// test(Time, '3/4')
// test(Pitch, { step: 6, octave: 0, accidental: '' }, '#3,')
// test(Duration, '=_..')
// test(Note, `b5''---.`)
// test(Rest, '0-..')
// test(Chord, `<1#351'>_`)
// test(Multipart, '<1- #1 | 12 3>')
// test(Direction, '/test', '\\測試')
// test(Bar, '|', '||', ':|', '|:', ':|:', '|]')
// test(Cell, { data: [new Time('6/8'), new Note('5'), new Rest('0'),
//                     new Chord(`<572'>`), new Bar('||')] },
//            '2/4 7,1 0   <246>_ <1 1|2 > \\be \n 1 /ab  | 2 ')
// test(Staff, '2/4 1 1 | 5  <15> | 6  \n 6 | 5- ')

// ----------------------------------------------------------------
// test(Attrs, 'abc="efg" xyz="123"')
// test(Comment, '<!-- abc \n  def -->')
// test(Element, '<hello/>', '<hello world="yes" b="a"/>', '<hello></hello>',
//               '<hello>world</hello>',
// `<a b="c">
//   <d g="e">f</d>
//   <!-- comment -->
//   <h>hello</h>
//   <i/>
// </a>
// `)
// test(XmlDecl, '<?xml version="1.0" encoding="ISO-8859-15"?>')
// test(Doctype, '<!DOCTYPE note SYSTEM "Note.dtd">')
// test(Document, `
// <?xml version="1.0" encoding="UTF-8" standalone="no"?>
// <!DOCTYPE score-partwise PUBLIC
//     "-//Recordare//DTD MusicXML 3.0 Partwise//EN"
//     "http://www.musicxml.org/dtds/partwise.dtd">
// <score-partwise version="3.0">
//   <part-list>
//     <score-part id="P1">
//       <part-name>Music</part-name>
//     </score-part>
//   </part-list>
//   <part id="P1">
//     <measure number="1">
//       <attributes>
//         <divisions>1</divisions>
//         <key>
//           <fifths>0</fifths>
//         </key>
//         <time>
//           <beats>4</beats>
//           <beat-type>4</beat-type>
//         </time>
//         <clef>
//           <sign>G</sign>
//           <line>2</line>
//         </clef>
//       </attributes>
//       <note>
//         <pitch>
//           <step>C</step>
//           <octave>4</octave>
//         </pitch>
//         <duration>4</duration>
//         <type>whole</type>
//       </note>
//     </measure>
//   </part>
// </score-partwise>
// `)
// ----------------------------------------------------------------

const value = `1155665- 4433221- 5544332- 5544332- 1155665-
1 <13> <135> <1357> <13571'> <1357> <135> <13> 1`
const cell = new Cell(value)

function component() {
  const testel = new Element(el('div', { style: 'width: 90%; margin: 15px' }, [
    el('h1', { style: 'font-size: 26px' }, 'Musje 123'),
    el('div', { style: 'width: 47%; float: left'}, [
      el('textarea', { style: 'width: 100%; height: 100px' },
        value
        // function () { load('scores/001.musje', txt => this.value = txt) }
      ),
      el('button', '()'),
      el('button', { click: () => player.play(cell) }, '&gt;'),
      el('button', { click: () => player.stop() }, '[]'),
      el('pre', { style: 'width: 100%; white-space: pre-wrap' }, cell),
    ]),
    el('div', { style: 'width: 47%; float: left; padding-left: 30px'}, [
      el('svg', { width: 500, height: 200 }, [
        el('rect', { x: 0, y: 0, width: 500, height: 200, style: 'fill: none; stroke-width: 1; stroke: black' }),
        el('circle', { cx: 20, cy: 20, r: 10}),
        el('text', { x: 20, y: 50 }, '5')
      ])
    ])
  ]))
  // console.log(JSON.parse(JSON.stringify(testel)), '' + testel)
  // console.log(testel.create())

  // load('scores/001.musje', txt => console.log(txt))

  return testel.create()
}

document.body.appendChild(component())
