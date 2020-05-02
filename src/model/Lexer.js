import makeLexerClass from '../utils/makeLexerClass'
import SLComment from './SLComment'
import MLComment from './MLComment'

const cjk = '\u2E80-\u2FD5\u3190-\u319f\u3400-\u4DBF\u4E00-\u9FCC\uF900-\uFAAD'
const letter = `A-Za-z\u00C0-\u024F${cjk}`
const pitch = '[#nb]*[1-7][,\']*'

const Lexer = makeLexerClass({
  0: '0',
  ',': ',',
  '/': '\\/',
  '\\': '\\\\',
  '<': '<',
  '>': '>',
  '|': '\\|',
  '~': '~',
  '-': '-',
  '(': '\\(',
  ')': '\\)',
  '[': '\\[',
  ']': '\\]',
  ':': ':',
  '/\\': '[\\/\\\\]',
  '==': '==',
  '--': '--',
  '//': '\\/\\/',
  '/*': '\\/\\*',
  '*/': '\\*\\/',
  digit: '\\d',
  digits: '\\d+',
  paran: '[\\(\\)]',
  letter: `[${letter}]`,
  word: `[${letter}]+`,
  words: `[${letter} ]+`,
  abbreviation: `[${letter}\\.]+`,
  midi: 'midi', channel: 'channel', program: 'program', pan: 'pan',
  title: 'title:',
  subtitle: 'subtitle:',
  composer: 'composer:',
  lyricist: 'lyricist:',
  arranger: 'arranger:',
  source: 'source:',
  beats: '[1-9]\\d{0,3}',
  beatType: '[1-9]\\d{0,3}',
  step: '[1-7]',
  accidental: '(#{1,2}|n|b{1,2})',
  octave: `('{1,5}|,{1,5})`,
  type: '(---|-|={0,5}_|={1,5})',
  dots: '\\.{1,2}',
  pitch,
  duration: '[-_=]*\.{1,2}',
  time: '[1-9]\\d{0,3}\\/',
  note: `[\\(\\[\\d:]*${pitch}`,
  rest: '0',
  chord: `<(${pitch})*>`,
  multipart: '<',
  direction: `[\\/\\\\][${letter} ]+`,
  bar: '(:\\|:?|\\|:|\\|[\\|\\]]?)',
  wedge: 'wedge',
  dynamics: '(p{1,6}|f{1,6}|m[pf]|sfp{0,2}|fp|rfz?|sf{1,2}z|fz)',
  'tuplet-begin': '\\[\\d+:',
  'tuplet-end': ':\\]',
  'lyrics-head': 'lyrics.*:',
  lyric: `([A-Za-z\u00C0-\u024F,\\.!\']+|[${cjk}])`,
  cell: '([\\(\\[]*[#nb]?\\d|<|[\\:\\|]|[\\/\\\\])',
  'part-head': '==',
  'sl-comment': '\\/\\/',
  'ml-comment': '\\/\\*',
  comment: '\\/[\\/\\*]',
  'all': '.*'
})

Lexer.prototype.skipWhite = function () {
  while ((this.is('S') || this.is('comment') || this.eol) && !this.eof) {
    if (this.eol) {
      this.nextLine()
    } else if (this.is('S')) {
      this.token('SS')
    } else if (this.is('sl-comment')) {
      new SLComment(this)
    } else {
      new MLComment(this)
    }
  }
}

export default Lexer
