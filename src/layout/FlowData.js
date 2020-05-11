import MeasureLayout from './MeasureLayout'
import { lastItem, max, min, sum, findIndexRight } from '../utils/helpers'

class FlowDataSectionInterface {
  get ballanceIDone() { return this.maxLen - this.minLen <= 1 }
  get maxLen() { return max(this.lines.map(line => line.len)) }
  get minLen() { return min(this.lines.map(line => line.len)) }
}

export default class FlowData extends FlowDataSectionInterface {
  constructor({ measures, fhsw, ahsw, style }) {
    super()
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

class Section extends FlowDataSectionInterface {
  constructor(lines) {
    super()
    this.lines = lines
  }

  ballanceReflow() {
    const { lines } = this
    const flowOneDown = (tmpMwss, idx) =>
                              tmpMwss[idx + 1].unshift(tmpMwss[idx].pop())

    // Flow down from the maxLenLine
    while (!this.ballanceIDone) {
      const mlIdx = this.findMaxLenLineIndex()
      const tmpMwss = lines.map(line => line.mws.slice())

      for (let i = mlIdx; i < lines.length - 1; i++){
        flowOneDown(tmpMwss, i)
        while (tmpMwss.length > 1 && sum(tmpMwss[i]) > lines[i].sw) {
          flowOneDown(tmpMwss, i)
        }
      }
      const othersMaxLen = new Section(lines.slice(0, lines.length - 1)).maxLen
      if (lastItem(tmpMwss).length > othersMaxLen) break   // failed (overflow)
      this.updateLines(tmpMwss)
    }
  }

  findMaxLenLineIndex() {
    const { maxLen } = this
    return findIndexRight(this.lines, line => line.len === maxLen)
  }

  // Update mws & ws & measures by tmpMwss.
  updateLines(tmpMwss) {
    const { lines } = this
    lines.forEach((line, i) => { line.mws = line.ws = tmpMwss[i] })
    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i], nextLine = lines[i + 1]
      while (line.measures.length > line.mws.length) {
        nextLine.measures.unshift(line.measures.pop())
      }
    }
  }
}
