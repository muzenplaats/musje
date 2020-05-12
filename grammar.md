# Grammar of Musje 2.0

The grammar is shown in a variation of BNF form with commented productions.

## Score
```
Score := Head? Body?      // => Score = { head: Head{}, body: Body{} }
                          // Note that an empty string is in language.
```

## Head
```
Head := name-value-pair+   // => Head = { title: str, subtitle: str, ... }
name-value-pair := name ':' value
name := 'title' | 'subtitle' | 'composer' | 'lyricist' | 'arranger'
value := without-newline
```

## Body
```
                       
Body := PartHead? Part (PartHead Part)*   // => Body = { parts: [Part{}, ..] }

PartHead := '==' name? ('(' abbr ')')? (':' midi-desc)
midi-desc := 'midi' '(' 'channel' ':' digits ','
                        'program' ':' digits ','
                        'pan': digits ')'

Part := '--'? Staff ('--' Staff)*         // => Part = { head: PartHead{}, staves: [Staff{}, ..]}
Staff := Bar? Cell* Lyrics*               // =>Staff = { cells: [Cell{}, ..], lyrics: [Lyrics{}] }
```

## Cell
```
Cell := MusicData* Bar?            // => Cell = { data: [MusicData{} including Bar{}] }

MusicData := Time | Note | Rest | Chord | Multipart | Direction

Time := beats '/' beat-type        // => Time = { beats: int, beatType: int }
Note := Pitch Duration?            // => Note = { pitch: Pitch{}, duration: Duration }
Rest := '0' Duratin?               // => Rest = { duration: Duration{} }
Chord := '<' Pitch+ '>' Duration?  // => Chord = { pitches: [Pitch{}, ..], duration: Duration{} }

// Multipart is designed for layers, partial implemented.
Multipart := '<' Layer ('|' Layer)+ '>'       // => Multipart = { name: 'multipart', layers: [Layer{}, ..] }
Layer := (Note | Rest | Chord | Direction)+   // => Layer = { data: [Note{}, Rest{}, Chord{}, or Direction{}]}

// Experimental
Direction := placement (dynamics | words | wedge)  // => Direction = { placement: str, words: str, wedge: str }
placement := '/' | '\'    // above|below

Bar := '|' | '||' | '|:' | ':|' | ':|:' : '|]'     // => Bar = { value: str }

Pitch := accidental? step octave?                  // => Pitch = { step: int, accidental: str, octave: int }
accidental := '#' | '##' | 'n' | 'b' | 'bb'
step := [1-7]
octave := /'{1,5}/ | /,{1,5}/

Duration := type? dots?                            // => Duration = { type: int, dots: int }
type := '-' | '---' | '_' | '='{1,5} '_'?
dots := '.' | '..'
```

## Lyrics
```
Lyrics := 'lyrics:' (Lyric | LyricControl)*   // => Lyrics = [Lyric{}, or LyricControl{}, ..]
Lyric := (western-word-punct | cjk-letter) '-'?
LyricControl := instruction 'm'? digits   // m for measure, or note
instruction := '@' | '+' | '-'    // at|forward|backward
```
