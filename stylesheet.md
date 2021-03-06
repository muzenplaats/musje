# Musje Stylesheet

Musje stylesheet contains information for presentation of the resulted jianpu sheet music. It is categorized to be base, font and typeset.

## Base

```
base {
  size: 18px
}
```
The unit in musje stylesheet can be `px` or `%`, and the percent is defined with the `base.size`.

## Font

```
title-font {
  family: Times New Roman
  size: 120%
  height-ratio: 0.9
  dy-ratio: 0.75
}
subtitle-font {
  family: Times New Roman
  size: 110%
  width-ratio: 0.45
  height-ratio: 0.9
  dy-ratio: 0.8
}
creator-font {
  family: Times New Roman
  size: 100%
  width-ratio: 0.45
  height-ratio: 0.9
  dy-ratio: 0.8
}
part-name-font {
  family: Times New Roman
  size: 80%
  width-ratio: 0.45
  height-ratio: 0.9
  dy-ratio: 0.8
}
time-font {
  family: Cadence
  size: 100%
  width-ratio: 0.45
  height-ratio: 0.52
  dy-ratio: 0.51
}
step-font, rest-font {
  family: Times New Roman
  size: 100%
  width-ratio: 0.45
  height-ratio: 0.69
  dy-ratio: 0.68
}
accidental-font {
  family: Cadence
  size: 90%
  width-ratio: 0.3
  height-ratio: 0.75
  dx-ratio: 0.3
  dy-ratio: 0.39
  lift: 25%
}
tuplet-font {
  family: Times New Roman
  size: 90%
  height-ratio: 0.9
  dy-ratio: 0.75
}
direction-font {
  family: Times New Roman
  size: 70%
  height-ratio: 0.9
  dy-ratio: 0.5
}
dynamics-font {
  family: Cadence
  size: 100%
  width-ratio: 0.45
  height-ratio: 0.52
  dy-ratio: 0.51
}
lyrics-font {
  family: Times New Roman
  size: 90%
  height-ratio: 0.9
  dy-ratio: 0.75
}
```

## Typeset

```
score {
  width: 450px
  margin-left: 20px
  margin-top: 20px
  margin-right: 20px
  margin-bottom: 20px
  head-body-sep: 20px
}

head {
  title-subtitle-sep: 70%
  title-creator-sep: 75%
  creators-sep: 30%
}

body {
  systems-sep: 200%
}

system {
  align: justify  // left|justify|equal
  staves-sep: 100%
  part-name-padding-right: 30%
}

system-head {
  braced-staves: Piano, test
  brace-padding-right: 10%
  brace-width: 30%
  brace-stroke-width: 10%
}

cell {
  padding-left: 60%
  padding-right: 60%
  data-sep: 30%
  data-direction-sep: 30%
}

bar {
  line-height: 100%
  light-width: 5%
  heavy-width: 15%
  dot-size: 12%
  lines-sep: 15%
  dots-sep: 20%
  line-dot-sep: 12%
}

time {
  line-height: 6%
  line-ext: 5%
  line-number-sep: 5%
}

note {
  pitch-beam-sep: 9%
  pitch-line-sep: 60%
  pitch-dot-sep: 6%
}

chord {
  pitches-sep: 10%
  tie-mode: single  // single|multiple
}

note, chord {
  pitch-tuplet-sep: 30%
  data-lyric-sep: 50%
  lyrics-v-sep: 50%
  lyrics-h-sep: 50%
}

direction {
  tmp: 0
}

pitch {
  step-accidental-sep: 0%
  step-octave-sep: 7%
  octave-size: 12%
  octaves-sep: 6%
}

durationGE4 {
  beam-height: 5%
  beams-sep: 10%
  dot-lift: 6%
  dot-size: 12%
  dots-sep: 10%
}

durationLE2 {
  line-width: 50%
  line-height: 6%
  lines-sep: 60%
  line-dot-sep: 60%
  dot-size: 12%
  dots-sep: 60%
}

tie {
  lift: 70%
  stroke-width: 9%
}

slur {
  lift: 70%
  stroke-width: 9%
}

tuplet {
  lift: 30%
  stroke-width: 5%
}
```
