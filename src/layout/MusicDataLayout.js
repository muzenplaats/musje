import AbstractLayout from './AbstractLayout'
import NoteLayout from './NoteLayout'
import RestLayout from './RestLayout'
import ChordLayout from './ChordLayout'
import MultipartLayout from './MultipartLayout'
import TimeLayout from './TimeLayout'
import DirectionLayout from './DirectionLayout'
import { max, lastItem } from '../utils/helpers'


export default class MusicDataLayout extends AbstractLayout {
  constructor(data, style) {
    super()
    this.name = 'music-data-layout'
    this.data = data
    this.style = style
    this.setLayouts()
    // this.setMinWidth()

    // Tmp
    // this.width = this.minWidth
    this.setHeight()
  }

  setLayouts() {
    const { style } = this

    this.layouts = this.data.map(dt => {
      switch (dt.name) {
        case 'note':  return new NoteLayout(dt, style)
        case 'rest':  return new RestLayout(dt, style)
        case 'chord': return new ChordLayout(dt, style)
        case 'multipart': return new MultipartLayout(dt, style)
        case 'time':  return new TimeLayout(dt, style)
        case 'direction': return new DirectionLayout(dt, style)
        // default: throw new TypeError('Unknown layout: ' + dt.name)
      }
    }).filter(dt => dt)
  }

  // Set by MeasureLayout
  setMinWidth() {
    const firstStick = this.sticks[0]
    const lastStick = lastItem(this.sticks)

    this.minWidth = firstStick.dx + lastStick.x + lastStick.dx2
    this.width = this.minWidth
  }

  // setMinWidth() {
  //   const { dataSep } = this.style.cell
  //   const { layouts } = this
  //   const { length } = layouts
  //   this.minWidth = length ? (length - 1) * dataSep : 0
  //   layouts.forEach(layout => { this.minWidth += layout.width })
  // }

  setHeight() {
    const dy = max(this.layouts.map(layout => layout.dy).concat(0))
    const dy2 = max(this.layouts.map(layout => layout.dy2).concat(0))

    this.height = dy + dy2
    this.dy = dy
  }

  set position(pos) {
    super.position = pos
    const { dataSep, dataDirectionSep } = this.style.cell
    let { x, by } = this

    // this.layouts.forEach(layout => {
    //   layout.position = { x, by }
    //   x = layout.x2 + dataSep
    // })

    this.sticks.forEach(stick => {
      const { dirsAbove, main, dirsBelow, x: sx } = stick
      const bx = x + sx

      if (main) {
        main.position = { bx, by }
      }

      // Tmp
      if (dirsAbove && dirsAbove.length) {
        const y2 = main.y - dataDirectionSep
        dirsAbove[0].position = { bx, y2 }
      }

      // Tmp
      if (dirsBelow && dirsBelow.length) {
        const y = by + dataDirectionSep
        dirsBelow[0].position = { bx, y }
      }
    })
  }

  toJSON() {
    const { layouts } = this
    return { 
      ...super.toJSON(), layouts 
    }
  }
}
