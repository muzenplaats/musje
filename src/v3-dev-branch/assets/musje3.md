# musje v3

```js
const tokens = {
  '=': '=',
  '(': '\\(',
  ')': '\\)',
  '[': '\\[',
  ']': '\\]',
  '{': '\\{',
  '}': '\\}',

  '//': '//',
  '/*': '/*',
  '*/': '*/',

  'sm-ident': '[a-zA-Z][a-zA-Z\\d]*',
  'cap-ident': '[A-Z][a-zA-Z\\d]*'
}
```


```grammar
Document := ()

import := 'import' $ident WS ('from' WS)

assignment := ident '=' expression

expression := paren | function | object-expression | array-expression | literal WS
paren := '(' WS expression ')' WS
function := ident '(' WS expression-list ')' WS
expression-list := '' | expression (',' WS expression)*


literal := time-signatural-literal |

time-signatural-literal := beats '/' beat-type

SS := ' '*
TrailingSS := SS? SLComment?
WS := ([ \n] | SLComment | MlComment)*
SLComment := '//'
MLComment := '/*' without-'*/' '*/'
```


```musje
p2 = import(the-file)
import p2 from the-path/to/file-with-p2
import theFilename  || equals to:
                    || import theFilename from theFilename

title1 = The Title
score1 = Score {
  head: Head {
    title: ${title1} The Title
    subtitle: The Subtitle
    composer: The Composer
  }
  body: Body {
    parts: [
      Part {

      }
    ]
  }
}

score2 = Score {
  head
  body: Body {
    parts: Part [
      p1, p2
    ]
  }
}

head = Head {
  title: The Title
}

|| This is pause; same as comment
|| \|| escape pause
||





p1 = Part {
  name: Piano  || primitive no-quoat string; variable?
  abbreviation: Pia.
  midi: 5
  measures: Measure [
    2/4 1 2 | 3 4 | 5 6
  ]
}

|| MusicData
t = Time { beats: 2, beatType: 4 }
t = 2/4  || time-signature literal

p = Pitch { step: 1 accidental: #, octave; -1 }  || default accidental = 0, octave = 0

n = #1,  || note literal
r = Rest { duration: d }
d = Duration { type: 4, dots: 0 }
d = 0  || rest literal



```
