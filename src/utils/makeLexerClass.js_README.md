# makeLexerClass.js

## APIs in summary

### Make a lexer class
Make a Lexer class with definition of token names with their patterns.

```js
const tokenPatterns = {
  tokenName1: pattern1,   // cannot produce ''
  ...otherPatterns
}
const Lexer = makeLexerClass(tokenPatterns)
```
A token is by definition `{ name, lexeme }`.
The token name is referred to as token in the APIs,
because it is treated as the identifier of token.

The default patterns as the following are used in some APIs, and they can be overwritten
to specify the white-space-for-you or pattern-for-your-all.

```js
const defaultPatterns = {
  S: ' ',
  SS: ' +',
  ALL: '.+'
}
```

### Make a lexer
```js
const lexer = new Lexer(src)
```

### Usage in parser
The lexer is sort of a token string and it is stateless.
Technically, it has a cursor state, which is behind the next token, and some other properties shown below.
```js
lexer.token(token, act)     // e.g., token(token, lexeme => { value = lexeme })
lexer.optional(token, act)
````

Look-ahead token predicate:
```js
lexer.is(token)
```
This lexer can be thought of as a container of context states, but only the parser has knowledge to tell it.
This is sometimes good for not letting the lexer (less knowlegable) to handle the states.

In summary, this lexer only do the tokenization one by one, and the parser decides when to do.
The pratice is that a main parser inits and distributes the work to subparsers by means of the grammar.
It can be seen as a lower-level AST; the AST is not a data structure but a control logic.
The possible advantage is that one can easily convert this to data or incorporate extra data flow in the control logic.
For example, a while-loop does a parallel list selection, and procedual subparser calls are in serial.
Nontheless, any subpaser call is a branch-ret, and it naturally goes to the recursive walk and back to the
caller to form, sort of, a syntax tree.

### Prevent
```js
lexer.prevent(token)
lexer.escprevent(token, escToken)  // escaped prevent
```
These make a possible and temporary boundary for a token at right to prevent it from
the consuming by the left (next) token.
The temporary unbound state will be recovered by `lexer.token()` or `lexer.optional()`.

### Error
```js
lexer.error(message)  // throw new Error(message + ..)
```

### Properties
```js
lexer.line    // current line
lexer.ln      // current index of line
lexer.col     // current index column
lexer.eol     // is end of line
lexer.eof     // is end of file
```

### Sugars
```js
lexer.skipWhite()     // (S | NL)*
lexer.skipSS()        // S*
lexer.without(token)              // All but not token
lexer.escwithout(token, escToken) // as above, escaped version
lexer.mlwithout(token)            // multi-line without
```

### Suggestions for praticing
- Take the `lexer.error(message)` as a possible debugging tool.
- If white space handling is confusing, it is readily in any grammar: do it in the end not in the front in any subparser,
  but only do the main parser in the front.
- Token abstraction, pretend a higher level "Token" in the following two cases:
  ```
  A := B | C | D
  while (lexer.is('A'), ..) {  // in list A rather than within items B, C and D
    ...
  }
  ```
  ```
  value := number | ident | paran
  paran := '(' expr ')'
  if (lexer.is(paran)) {/* go to the paran subparser */} // is preferred than if (lexer.is('(')) {} thought they are the same.
  ```
It is by definition of the grammar that 'A' or 'paran' will never be used to produce a lexeme, but only as a look-ahead token.
But it can be subtle that one might want to play a trick to keep the error handling in or out.
