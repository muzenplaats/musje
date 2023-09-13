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

    this.dx = this.layouts.length === 0 ? 0 : this.layouts[0].dx
    // this.setMinWidth()  // will be set by measureLayout.
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

  // This will be called by MeasureLayout
  setMinWidth() {
    let firstStick = this.sticks[0]

    if (!firstStick) {
      this.minWidth = 0
      this.width = 0
      return
    }

    if (firstStick.main.name === 'multipart-layout') {
      firstStick = firstStick.main.layersLayouts[0].sticks[0]
    }

    let lastStick = lastItem(this.sticks)

    if (lastStick.main.name === 'multipart-layout') {
      lastStick = lastItem(lastStick.main.layersLayouts[0].sticks)
    }

    this.minWidth = firstStick.dx + lastStick.x + (lastStick.dx2 || 0)  // tmp: 0
    this.width = this.minWidth
  }

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

    const setDtPosition = stick => {
      const { dirsAbove, main, dirsBelow, x: sx } = stick
      let bx = x + sx

      if (main) {
        if (main.name === 'multipart-layout') {
          bx = x + main.layersLayouts[0].dataLayout.sticks[0].dx
        }

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
    }

    this.sticks.forEach(setDtPosition)
  }

  toJSON() {
    const { layouts } = this
    return { 
      ...super.toJSON(), layouts 
    }
  }
}
