import MeasureLayout from './MeasureLayout'
import { lastItem, max, min } from '../utils/helpers'

export default class FlowData {
  constructor({ measures, fhsw, ahsw, style }) {
    this.measures = measures
    this.measureMinWidths = measures
          .map(measure => new MeasureLayout(measure, style))
          .map(MeasureLayout => MeasureLayout.minWidth)
    this.fhsw = fhsw
    this.ahsw = ahsw
    this.lines = []
  }

  get lens() { return this.lines.map(line => line.len)}

  set lens(list) {
    if (!list.length || list[0] === 0) return

    this.lines = []
    list.forEach((len, sys) => {
      const sw = sys ? this.ahsw : this.fhsw
      this.lines.push(new FlowDataLine(sw, sys))
    })
    this.set('mws', 'measureMinWidths', list)
    this.set('measures')
    this.set('ws')
    this.setIsObstacles()
  }


  get ballanceIDone() { return ballanceIDone(this.lines) }

  obstacleSectioning() {
    const sections = []

    // this.lines.forEach(line => {
    //   console.log(line.sys, line.len, line.isObstacle)
    // })
    let begin = 0, end, prevIsObstacle = false
    this.lines.forEach((line, sys) => {
      if (prevIsObstacle) { begin = sys; prevIsObstacle = false; return }
      if (line.isObstacle) {
        end = sys
        sections.push(new Section(this.lines.slice(begin, end)))
      }
      prevIsObstacle = line.isObstacle
    })
    if (!prevIsObstacle) {
      sections.push(new Section(this.lines.slice(begin, this.lines.length)))
    }

    // console.log(sections)

    return sections
  }

  set(abbr, name, lens) {
    name = name || abbr

    if (abbr === 'ws') {
      this.lines.forEach(line => { line.ws = line.mws.slice() }); return
    }

    let begin = 0, end
    (lens || this.lens).forEach((len, l) => {
      end = begin + len
      this.lines[l][abbr] = this[name].slice(begin, end)
      begin = end
    })
  }

  setIsObstacles() {
    this.lines.forEach((line, sys) => {
      if (sys === 0) {
        line.isObstacle = false
      } else {
        const prevLine = this.lines[sys - 1]
        if (prevLine.isObstacle) {
          line.isObstacle = false
        } else {
          line.isObstacle = lastItem(prevLine.mws) + line.mws[0] > line.sw
        }
      }
    })
  }
}

class FlowDataLine {
  constructor(sw, sys) {
    this.mws = []           // minWidths of measures in the system
    this.sw = sw            // system width
    this.sys = sys          // system index
  }

  get len() { return this.mws.length }
}

class Section {
  constructor(lines) {
    this.lines = lines
  }

  get ballanceIDone() { return ballanceIDone(this.lines) }

  ballanceReflow() {
    console.log(this.ballanceIDone)

    // Todo
  }
}

const ballanceIDone = lines => {
  const maxLen = max(lines.map(line => line.len))
  const minLen = min(lines.map(line => line.len))
  return maxLen - minLen <= 1
}
