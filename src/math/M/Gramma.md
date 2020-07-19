## Gramma

— Parser section
Prog ::= stmt*
stmt := assign | expr
assign := ident ‘=‘ expr

expr := power (powop power)*
power := factor (mulop factor)*
factor := term (addop term)*
term := //
value := number | ident | func | paran

— Lexer section
mulop := ‘*’’ | ‘/‘
addop := ‘+’ | ‘-‘
powop := ‘^’
number := integer flt-point?
pm = /[\+\-]
integer := pm?[1-9]\d*/
flt-point := /\.\d+/ (/[eE]/ integer)?

ident := [a-zA-Z_\$]+
func := ident ‘(‘ params ‘)’
params := expr (‘,’ expr)* | ‘’
paran := ‘(‘ expr ‘)’

