# makeLexerClass.js

## APIs in summary

### Create a lexer class
```js
const tokenPatterns = {
  tokenName1: pattern1,   // cannot produce ''
  ...otherPatterns
}
const Lexer = makeLexerClass(tokenPatterns)
```
A token is by definition `{ name, lexeme }`.
The token name is referred to as token in the APIs,
because it is treated as an identifier of token.

The default patterns as the following can be reset
to specify the white-space-for-you or pattern-for-your-all.

```js
const defaultPatterns = {
  S: ' ',
  SS: ' +',
  ALL: '.+'
}
```

### Usage in parser
The lexer is as a token string and it is stateless.
```js
lexer.token(token, act = lexeme => { vale = lexeme })
lexer.optional(token, act)
````

It is the parser's interest to switch the lexer state using the predicate:
```js
lexer.is(token)
```
But the lexer has no other state to be switched,
and said, the language is the state (0 -> eof).
Therefore, the lexer is like a stream and the parser is the stream player.
It may have some advantages that letting the parser maintain
(higher-level branch) the lexing psuedo-states,
and provides the wanted flexibilities for the parser.

### Prevent
```js
lexer.prevent(token)
lexer.escprevent(token, escToken)  // escaped prevent
```
These make a possible boundary for a right token to prevent
from the consuming of the left one.

### Error
```js
lexer.error(message)  // throw new Error(message + ..)
```

### Properties
```js
lexer.line    // current line
lexer.ln      // current line number
lexer.col     // current column number
lexer.eol     // is end of line
lexer.eof     // is end of file
```

### Sugars
```js
lexer.skipWhite()     // (S NL)*
lexer.skipSS()        // S*
lexer.without(token)              // All !token
lexer.escwithout(token, escToken) // (escaped version)
lexer.mlwithout(token)            // multi-line without
```
