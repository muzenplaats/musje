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

The default patterns as the following are used in some APIs and they can be overwritten,
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
The lexer is as a token string and it is stateless.
A technical state is a cursor behind the next token.
```js
lexer.token(token, act = lexeme => { vale = lexeme })
lexer.optional(token, act)
````

The predicate tells a look-ahead token:
```js
lexer.is(token)
```
But the lexer has no other state to be switched,
and said, the language is the state (0 -> eof).
Or said, the stateless lexer cannot read the script at all, and it need the parser to go on.
This lexer can be thought of as a context.
It be think that the typical lexer does a state switch (e.g., German->English), while the parser using this lexer
may do in the context switch (e.g. Topic domain, 1->2) means.

The lexer can be compared as a stream and the parser the stream player.
It may have some advantages that letting the parser maintain
(higher-level branch) the lexing psuedo-states,
and provides the wanted flexibilities for the parser.

In summary, this lexer does not tokenize the source at once, but provides APIs for the parser.
The parser generally does not want to produce an AST as in the parser generators do.
However, for example, a list is hidden in a while-loop or a tree (graph) is readily a sub-parser
calling a sub-parser. It could be said that a parser favoring distributed sub-parsers.

For thinking, the idea from the "Let's Build a Compiler" apealed to some such as the author.
It is intuitive, almost without any techincal jargons and led the topic here.
The author always favors a parser genenrator, but the awkward musje language could not be easily parsed,
at least, for severally ambiguities.

One might think that the ?AST here is procedual-wise instead of data-wise.
It can always perform resulted in data, but can not easily do backward.
If this way had values, for example, how to do optimization, e.g., codegen(), or others?

### Prevent
```js
lexer.prevent(token)
lexer.escprevent(token, escToken)  // escaped prevent
```
These make a possible temporary boundary for a right token to prevent
from the consuming of the left one.
The temp. unbound state will be recovered by `lexer.token()` or `lexer.optional`.

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
