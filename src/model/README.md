# Quick code review before digging in

## Musje Model

```js
Score {
	head: Head {
    title: String,
    subtitle: String,
    composer: String,
    lyricist: String,
    arranger: String,
    source: String
	},

	body: Body {
    parts: Array[
      Part {}, Part {}, ...
    ],  // part-wise
    
    measures: Array[
      Measure {}, Measure {}, ...
    ],  // time-wise

    fillStaves() {},
    makeMeasures() {}
  }
}


Part {
	head: PartHead {
		partName: String,
		abbreviation: String,
		midi: {}
	},

	staves: Array[
		Staff {}, Staff {}, ...
	]
}

Measure {
	parts: Array[],
	leftBar: Bar {},
	rightBar: Bar {},

	setPartsToCellsIndices() {}
}


Staff {
	cells: Array [
		Cell {}, Cell {}, ...
	],

	// lyricsLines,

	resetLeftBars() {},
	setBeams() {},
	linkTies() {},
	setMusicDataT() {},
	placeLyrics?() {}
}

Cell {
	data: Array [
		Time {}, Clef {}, Key {}, Note {}, Rest {}, Chord {}, Multipart {}, Direction {} 
	],
	leftBar: Bar {},
	rightBar: Bar {},

	setAlters() {},
	setModifications() {},
	linkTuplets() {},
	extracBars() {}
}

Note {
	articulation ??,
	pitch: Pitch {},
	duration: Duration {},
	tie?: Tie {},
	tuplet?: Tuplet {},
	beginSlurs?: Slur {},
	endSlurs?: Slur {},
	lyric?: Lyric
}

Rest {
	duration: Duration {}
}

Chord {
	articulation ??,
	pitches: Array [
		Pitch {}, Pitch {}, ...
	],
	duration: Duration {},
	tie?: Tie {},
	tuplet?: Tuplet {},
	beginSlurs?: Slur {},
	endSlurs?: Slur {},
	lyric?: Lyric
}

Multipart {
	layers: Array [
		Layer {}, Layer {}, ...
	]
}

Layer {
	data: Array [
		Note {}, Rest {}, Chord {}, Direction {}, ...
	]
}

Duration {
	type: Number,
	dots: Number,

	initBeams() {}
}

```
