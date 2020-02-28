import makeLexerClass from '../utils/makeLexerClass'

const cjk = '\u2E80-\u2FD5\u3190-\u319f\u3400-\u4DBF\u4E00-\u9FCC\uF900-\uFAAD'
const letter = `A-Za-z${cjk}`
const pitch = '[#nb]*[1-7][,\']*'

const Lexer = makeLexerClass({
  0: '0',
  '/': '\\/',
  '\\': '\\\\',
  '<': '<',
  '>': '>',
  '|': '\\|',
  '/\\': '[\\/\\\\]',
  '//': '\\/\\/',
  '/*': '\\/\\*',
  '*/': '\\*\\/',
  letter: `[${letter}]`,
  word: `[${letter}]+`,
  words: `[${letter} ]+`,
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
  note: pitch,
  rest: '0',
  chord: `<(${pitch})*>`,
  multipart: '<',
  direction: `[\\/\\\\][${letter} ]+`,
  bar: '(:\\|:?|\\|:|\\|[\\|\\]]?)',
  cell: '([#nb]?\\d|<|[\\:\\|]|[\\/\\\\])',
  'sl-comment': '\\/\\/',
  'ml-comment': '\\/\\*',
  comment: '\\/[\\/\\*]'
})

export default Lexer
