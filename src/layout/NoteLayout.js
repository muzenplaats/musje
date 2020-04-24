import AbstractLayout from './AbstractLayout'
import PitchLayout from './PitchLayout'
import DurationLayout from './DurationLayout'
import TieLayout from './TieLayout'
import SlurLayout from './SlurLayout'
import TextLayout from './TextLayout'

export default class NoteLayout extends AbstractLayout {
  constructor(note, style) {
    super()
    this.name = 'note-layout'
    this.note = note
    this.style = style
    this.pitchLayout = new PitchLayout(note.pitch, style)
    this.durationLayout = new DurationLayout(note.duration, style)
    this.setSize(note.duration, this.pitchLayout)

    const { tie, beginSlurs, endSlurs, lyrics } = note
    if (tie) this.tieLayout = new TieLayout(tie, style)
    if (beginSlurs) {
      this.beginSlursLayouts =
                           beginSlurs.map(slur => new SlurLayout(slur, style))
    }
    if (endSlurs) {
      this.endSlursLayouts = endSlurs.map(slur => new SlurLayout(slur, style))
    }
    if (lyrics) {
      this.lyricsLayouts = lyrics.map(lyric => {
        return new TextLayout(lyric.text, style.lyricsFont)
      })
    }
  }

  setSize(duration, pl) {
    const { type, dots } = duration
    if (type < 4) {
      this.setTypeLt4Size(pl)
    } else if (type === 4) {
      this.setType4Size(dots, pl)
    } else {
      this.setTypeGt4Size(dots, pl)
    }
    this.dy = this.height
  }

  setTypeLt4Size(pl) {
    const { durationLayout } = this
    const { pitchLineSep } = this.style.note
    this.width = pl.width + pitchLineSep + durationLayout.width
    this.height = pl.height
  }

  setType4Size(dots, pl) {
    const { pitchDotSep } = this.style.note
    const { durationLayout } = this
    this.width = pl.width +
                (dots ? durationLayout.width + pitchDotSep : 0)
    this.height = pl.height
  }

  setTypeGt4Size(dots, pl) {
    const { pitchBeamSep } = this.style.note
    const { stepFont } = this.style
    const { durationLayout } = this
    this.width = pl.width + (dots ?
                 durationLayout.width - stepFont.width : 0)
    this.height = pl.height + pitchBeamSep +
                  durationLayout.beamsLayout.height
  }

  set position(pos) {
    super.position = pos
    const { octave } = this.note.pitch
    const { type, dots } = this.note.duration
    const { dotLift } = this.style.durationGE4
    const { x, y, x2, y2 } = this
    const { stepLayout, octavesLayout } = this.pitchLayout
    this.pitchLayout.position = { x, y }

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

    const { tie, beginSlurs, endSlurs, lyrics } = this.note
    if (tie || beginSlurs || endSlurs) {
      const { cx: x, y } = this.pitchLayout.stepLayout
      if (tie) this.tieLayout.position = { x, y }
      if (beginSlurs) {
        this.beginSlursLayouts.forEach(layout => { layout.position = { x, y } })
      }
      if (endSlurs) {
        this.endSlursLayouts.forEach(layout => { layout.position = { x, y } })
      }
    }

    // Tmp
    if (lyrics) {
      const { cx } = this.pitchLayout.stepLayout
      this.lyricsLayouts.forEach(layout => {
        layout.position = { cx, y2: y2 + 20 }
      })
    }
  }

  toJSON() {
    const { pitchLayout, durationLayout } = this
    return { ...super.toJSON(), pitchLayout, durationLayout }
  }
}
