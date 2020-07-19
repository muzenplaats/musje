import makeLexerClass from '../utils/helpers'

const pm = '[\\+\\-]'
const integer = '${pm}1-9\\d*'
const decimal = '\\.\\d+'
const exp = '[eE${integer}]'

export default const Lexer = makeLexerClass({
  '+': '\\+',
  '-': '\\-',
  '*': '\\*',
  '/': '\\/',
  '^': '\\^',
  '(': '\\(',
  '(': '\\)',
  addop: pm
  mulop: '[\\*\\/]',
  powop: '\\^',
  paran: '[\\(\\)],
  flt_point: '((${decimal})(${exp}?))|((${decimal})?(${exp}))',
  number: `${integer}(${flt_point})?`,
  ident: 'a-zA-Z_\\$'
})

