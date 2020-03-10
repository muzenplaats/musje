import AbstractLayout from './AbstractLayout'
import HeadLayout from './HeadLayout'
import BodyLayout from './BodyLayout'

export default class ScoreLayout extends AbstractLayout {
  constructor(score, style) {
    super()
    this.score = score
    this.style = style
    this.headLayout = new HeadLayout(score.head, style)
    this.bodyLayout = new BodyLayout(score.body, style)
    this.setSize()
    this.innerLayout = new InnerLayout(this.height, style)
  }

  setSize() {
    const { width, marginTop, marginBottom, headBodySep } = this.style.score
    const hh = this.headLayout.height
    const bh = this.bodyLayout.height
    this.width = width
    this.height = marginTop + marginBottom + hh + bh +
                  (hh && bh ? headBodySep : 0)
  }

  set position(pos) {
    super.position = pos
    const { marginLeft: x, marginTop: y, headBodySep } = this.style.score
    const hh = this.headLayout.height
    const bh = this.bodyLayout.height
    if (hh) this.headLayout.position = { x, y }
    if (bh) this.bodyLayout.position = { x, y: y + hh + (hh ? headBodySep : 0) }
    this.innerLayout.position = { x, y }
  }

  toJSON() {
    const { innerLayout, headLayout, bodyLayout } = this
    return { ...super.toJSON(), innerLayout, headLayout, bodyLayout }
  }
}

class InnerLayout extends AbstractLayout {
  constructor(scoreLayoutHeight, style) {
    super()
    const { width, marginLeft, marginRight, marginTop, marginBottom } =
          style.score
    this.width = width - marginLeft - marginRight
    this.height = scoreLayoutHeight - marginTop - marginBottom
  }
}
