import AbstractLayout from './AbstractLayout'
import DurationLayout from './DurationLayout'
import NoteLayout from './NoteLayout'

const { setSize, setTypeLt4Size, setType4Size, setTypeGt4Size } =
      NoteLayout.prototype

export default class RestLayout extends AbstractLayout {
  constructor(rest, style) {
    super()
    this.name = 'rest-layout'
    this.rest = rest
    this.style = style
    this.zeroLayout = new ZeroLayout(style)
    this.durationLayout = new DurationLayout(rest.duration, style)
    this.setSize(rest.duration, this.zeroLayout)
  }

  setSize = setSize
  setTypeLt4Size = setTypeLt4Size
  setType4Size = setType4Size
  setTypeGt4Size = setTypeGt4Size

  set position(pos) {
    super.position = pos
    const { x, y, x2, y2 } = this
    const { type } = this.rest.duration
    const { dotLift } = this.style.durationGE4
    this.zeroLayout.position = { x, y }

    this.durationLayout.position =
        type === 4 ? { x2, y2: this.zeroLayout.y2 - dotLift } :
        type  >  4 ? { x: this.zeroLayout.x, y2 } :
     /* type  <  4 */{ x2, cy: this.zeroLayout.cy }
  }

  toJSON() {
    const { zeroLayout } = this
    return { ...super.toJSON(), zeroLayout }
  }
}

class ZeroLayout extends AbstractLayout {
  constructor(style) {
    super()
    Object.assign(this, style.restFont)
    this.dx = this.width / 2
  }
}
