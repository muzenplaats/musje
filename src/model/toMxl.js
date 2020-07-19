import Document, { el } from '../utils/XmlDocument'

const STEP_TO_ABC = { 1: 'C', 2: 'D', 3: 'E', 4: 'F', 5: 'G', 6: 'A', 7: 'B' }

const getPitch = pitch => {
  return el('pitch', [
    el('step', STEP_TO_ABC[pitch.step]),
    el('alter', pitch.alter),
    el('octave', pitch.octave + 4)
  ])
}

export default function () {
  const { head, body } = this
  const { title, composer } = head

  return new Document({
    xmlDecl: {
      attrs: { version: '1.0', encoding: 'UTF-8', standalone: 'no' }
    },

    doctype: {
      value: `score-partwise PUBLIC
    "-//Recordare//DTD MusicXML 3.1 Partwise//EN"
    "http://www.musicxml.org/dtds/partwise.dtd"`
    },

    root: el('score-partwise', { version: '3.1' }, [
      title ? el('movement-title', title) : [],
      el('identification', [
        composer ? el('creator', { type: 'composer' }, composer) : []
      ]),

      el('part-list', [
        el('score-part', { id: 'P1' }, [el('part-name', 'Music')])
      ]),
      el('part', { id: 'P1' }, [
        el('measure', { number: 1 }, [
          el('attributes', [
            el('divisions', 1), el('key'), el('time'), el('clef')
          ]),
          el('note', [
            getPitch({ step: 2, alter: 1, octave: 1 }),
            el('duration', 4),
            el('type', 'whole')
          ])
        ])
      ])
    ])
  }).toString()
}
