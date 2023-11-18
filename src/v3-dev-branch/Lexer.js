const makeLexerClass = require('./lib/makeLexerClass')

const capIdent =  '[A-Z][a-zA-Z\\d_]*'

module.exports = makeLexerClass({
  '{': '\{',
  '}': '\}',
  'cap-ident': capIdent,

  // Filters
  component: capIdent
})
