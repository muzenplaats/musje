# Grammar of Musje 2.0

The grammar is shown in a variation of BNF form with commented productions.

## Score
```
Score := Head? Body?      // Note that an empty string is in language.
                          // Score = { head: Head{}, body: Body{} }

                          // Head = { title: str, sub... }
```

## Head
```
Head := name-value-pair+
name-value-pair := name ':' value
name := 'title' | 'subtitle' | 'composer' | 'lyricist' | 'arranger'
value := without-newline
```

## Body
```
                          // Body = { parts: [Part{}, ..] }
Body := PartHead? Part (PartHead Part)*

PartHead := '==' name? ('(' abbr ')')? (':' midi-desc)
midi-desc := 'midi' '(' 'channel' ':' digits ','
                        'program' ':' digits ','
                        'pan': digits ')'

                          // Part = { head: PartHead{}, staves: [Staff{}, ..]}
Part := '--'? Staff ('--' Staff)*

                          // Staff = { cells: [Cell{}, ..], lyrics: [Lyrics{}]}
Staff := Bar? Cell* Lyrics*
                          // Cell = { data: [MusicData{} include Bar{}]}
```

## Cell
```
Cell := MusicData* Bar?

MusicData := Time | Note | Rest | Chord | Multipart | Direction

                          // Time = { beats: int, beatType: int }
Time := beats '/' beat-type
                          // Note = { pitch: Pitch{}, duration: Duration }
Note := Pitch Duration?
                          // Rest = { duration: Duration{} }
Rest := '0' Duratin?
                          // Chord = { pitches: [Pitch{}, ..], duration: Duration{} }
Chord := '<' Pitch+ '>' Duration?

// Multipart is designed for layers, partial implemented.
                          // Multipart = { name: 'multipart', layers: [Layer{}, ..] }
Multipart := '<' Layer ('|' Layer)+ '>'
                          // Layer = { data: [Note{}, Rest{}, Chord{}, or Direction{}]}
Layer := (Note | Rest | Chord | Direction)+

// Experimental
Direction := placement (dynamics | words | wedge)
placement := '/' | '\'    // above|below

Bar := '|' | '||' | '|:' | ':|' | ':|:' : '|]'

Pitch := accidental? step octave?
accidental := '#' | '##' | 'n' | 'b' | 'bb'
step := [1-7]
octave := /'{1,5}/ | /,{1,5}/

Duration := type? dots?
type := '-' | '---' | '_' | '='{1,5} '_'?
dots := '.' | '..'
```

## Lyrics
```
                          // Lyrics = [Lyric{}, or LyricControl{}, ..]
Lyrics := 'lyrics:' (Lyric | LyricControl)*
Lyric := (western-word-punct | cjk-letter) '-'?
LyricControl := instruction 'm'? digits   // m for measure, or note
instruction := '@' | '+' | '-'    // at|forward|backward
```
