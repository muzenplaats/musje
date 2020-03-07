import AbstractLayout from './AbstractLayout'
import PitchLayout from './PitchLayout'
import DurationLayout from './DurationLayout'
import NoteLayout from './NoteLayout'
const { setSize, setTypeLt4Size, setType4Size, setTypeGt4Size } =
      NoteLayout.prototype

export default class ChordLayout extends AbstractLayout {
  constructor(chord, style) {
    super()
    this.chord = chord
    this.style = style
    this.pitchesLayout = new PitchesLayout(chord.pitches, style)
    this.durationLayout = new DurationLayout(chord.duration, style)
    this.setSize(chord.duration, this.pitchesLayout)
  }

  setSize = setSize
  setTypeLt4Size = setTypeLt4Size
  setType4Size = setType4Size
  setTypeGt4Size = setTypeGt4Size

  set position(pos) {
    super.position = pos
    const { x, y, x2, y2 } = this
    this.pitchesLayout.position = { x, y }
    const { octave } = this.chord.pitches[0]
    const { type, dots } = this.chord.duration
    const { dotLift } = this.style.durationGE4
    const { stepLayout, octavesLayout } = this.pitchesLayout.layouts[0]

    // Tweak for dots height
    if (type > 4 && dots && octave < 0) {
      this.durationLayout.beamsLayout.height += octavesLayout.height +
                                                this.style.pitch.stepOctaveSep
      this.durationLayout.setSize()
    }

    this.durationLayout.position =
        type === 4 ? { x2, y2: stepLayout.y2 - dotLift } :
        type  >  4 ? { x: stepLayout.x, y2 } :
     /* type  <  4 */{ x2, cy: stepLayout.cy }
  }

  toJSON() {
    const { pitchesLayout } = this
    return { ...super.toJSON(), pitchesLayout }
  }
}

class PitchesLayout extends AbstractLayout {
  constructor(pitches, style) {
    super()
    this.pitches = pitches
    this.style = style
    const { pitchesSep } = style.chord
    let width = 0, height = -pitchesSep
    this.layouts = pitches.map(pitch => new PitchLayout(pitch, style))
    this.layouts.forEach(pitchLayout => {
      width = Math.max(width, pitchLayout.width)
      height += pitchLayout.height + pitchesSep
    })
    this.width = width
    this.height = height
  }

  set position(pos) {
    super.position = pos
    let { x2, y2 } = this
    this.layouts.forEach(pitchLayout => {
      pitchLayout.position = { x2, y2 }
      y2 = pitchLayout.y - this.style.chord.pitchesSep
    })
  }

  toJSON() {
    const { layouts } = this
    return { ...super.toJSON(), layouts }
  }
}
