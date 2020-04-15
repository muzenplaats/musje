import AbstractLayout from './AbstractLayout'

export default class BeamLayout extends AbstractLayout {
  constructor(beam, duration, dotsLayout, style) {
    super()
    this.name = 'beam-layout'
    this.beam = beam
    beam.layout = this
    this.duration = duration
    this.dotsLayout = dotsLayout
    this.style = style
    this.setSize()
  }

  get beamedWidth() { return this.beam.endBeam.layout.x2 - this.x }

  setSize() {
    const { stepFont, note, durationGE4 } = this.style
    this.width = stepFont.width +
            (this.duration.dots ? this.dotsLayout.width + note.pitchDotSep : 0)
    this.height = durationGE4.beamHeight
  }
}
