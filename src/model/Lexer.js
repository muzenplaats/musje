import makeLexerClass from '../utils/makeLexerClass'

const Lexer = makeLexerClass({
  0: '0',
  '<': '<',
  '>': '>',
  step: '[1-7]',
  accidental: '(#{1,2}|n|b{1,2})',
  octave: `('{1,5}|,{1,5})`,
  type: '(---|-|={0,5}_|={1,5})',
  dot: '\.{1,2}',
  pitch: '[#nb]*[1-7]',
  duration: '[-_=]*\.{1,2}',
  note: '[#nb]*[1-7]',
  rest: '0',
  chord: '<[#nb]*[1-7]'
})

export default Lexer
