import AbstractLayout from './AbstractLayout'
import TextLayout from './TextLayout'

export default class HeadLayout extends AbstractLayout {
  constructor(head, style) {
    super()
    this.name = 'head-layout'

    this.head = head
    this.style = style
    const { title, subtitle, composer, arranger, lyricist } = head

    if (title) {
      this.titleLayout = new TextLayout(title, this.style.titleFont)
    }
    if (subtitle) {
      this.subtitleLayout = new TextLayout(subtitle, this.style.subtitleFont)
    }
    if (composer) {
      this.composerLayout = new TextLayout(composer, this.style.creatorFont)
    }
    if (lyricist) {
      this.lyricistLayout = new TextLayout(lyricist, this.style.creatorFont)
    }
    this.setSize()
  }

  setSize() {
    const { title, subtitle, composer, lyricist, /*arranger*/ } = this.head
    const { width: scoreW, marginLeft, marginRight } = this.style.score
    const { titleSubtitleSep, titleCreatorSep, creatorsSep } = this.style.head
    let height = 0

    if (title) height += this.titleLayout.height
    if (title && subtitle) height += titleSubtitleSep
    if (subtitle) height += this.subtitleLayout.height
    if ((title || subtitle) && (composer || lyricist)) height += titleCreatorSep
    if (composer) height += this.composerLayout.height
    if (composer && lyricist) height += creatorsSep
    if (lyricist) height += this.lyricistLayout.height

    this.width = scoreW - marginLeft - marginRight,
    this.height = height
  }

  set position(pos) {
    const { title, subtitle, composer, lyricist, /*arranger*/ } = this.head
    const { titleSubtitleSep, titleCreatorSep, creatorsSep } = this.style.head
    super.position = pos

    const { cx, x2, y } = this
    let currY = y
    if (title) {
      this.titleLayout.position = { cx, y }
      currY = this.titleLayout.y2
    }
    if (subtitle) {
      this.subtitleLayout.position = {
        cx, y: title ? currY + titleSubtitleSep : y
      }
      currY = this.subtitleLayout.y2
    }
    if (composer) {
      this.composerLayout.position = {
        x2, y: currY > y ? currY + titleCreatorSep : y
      }
      currY = this.composerLayout.y2
    }
    if (lyricist) {
      this.lyricistLayout.position = {
        x2, y: composer ? currY + creatorsSep
                        : (title || subtitle ? currY + titleCreatorSep : y)
      }
    }
  }

  toJSON() {
    const { titleLayout, subtitleLayout, composerLayout } = this
    return { ...super.toJSON(), titleLayout, subtitleLayout, composerLayout }
  }
}
