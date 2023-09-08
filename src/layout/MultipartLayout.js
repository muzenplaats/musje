import AbstractLayout from './AbstractLayout'
import LayerLayout from './LayerLayout'

/*
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

Analogous

Measure {
  parts: Array[],
  leftBar: Bar {},
  rightBar: Bar {},

  setPartsToCellsIndices() {}
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

*/


export default class MultipartLayout extends AbstractLayout {
  constructor(multipart, style) {
    super()
    this.name = 'multipart-layout'

    this.multipart = multipart
    this.style = style
    this.layersLayouts = multipart.layers.map(layer => new LayerLayout(layer, style))

    this.width = 60
    this.height = 30
    this.dx = 0
    this.dy = 0
  }

  set position(pos) {
    super.position = pos
  }
}
