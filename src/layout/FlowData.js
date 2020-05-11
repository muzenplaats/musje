import MeasureLayout from './MeasureLayout'
import { lastItem, max, min, sum, findIndexRight,
         flatten, range } from '../utils/helpers'

class FlowDataSectionInterface {
  get isBalanced() { return this.maxLen - this.minLen <= 1 }
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
      this.lines.push(new FlowDataLine(sw))
    })
    this.set('mws', 'measureMinWidths', list)
    this.set('measures')
    this.set('ws')
    this.setIsObstacles()
  }

  obstacleSectioning() {
    const sections = []
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
    return sections
  }

  mergeSections(sections) {
    sections = sections.slice()
    let newLines = sections.shift().lines
    this.lines.forEach(line => {
      if (line.isObstacle) {
        newLines.push(line)
        const section = sections.shift()
        if (section) newLines = newLines.concat(section.lines)
      }
    })
    this.lines = newLines
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
  constructor(sw) {
    this.mws = []           // minWidths of measures in the system
    this.ws = []
    this.measures = []
    this.sw = sw            // system width
  }

  get len() { return this.mws.length }

  optimizeMeasureWidths() {
    const { sw } = this
    const idxWs = this.ws.map((w, i) => ({ i, w }))
    const sumWs = () => sum(idxWs.map(idxW => idxW.w))
    const setGroupWidth = i => {
      const restWith = sum(idxWs.slice(i + 1).map(idxW => idxW.w).concat(0))
      let width = (sw - restWith) / (i + 1)
      if (i < idxWs.length - 1) width = Math.min(width, idxWs[i + 1].w)
      range(i + 1).forEach(n => { idxWs[n].w = width })
    }

    idxWs.sort((a, b) => a.w - b.w)

    for (let i = 0; i < idxWs.length; i++) {
      setGroupWidth(i)
      if (sumWs(idxWs) >= sw) break
    }

    idxWs.sort((a, b) => a.i - b.i)
    this.ws = idxWs.map(idxW => idxW.w)
  }
}

class Section extends FlowDataSectionInterface {
  constructor(lines) {
    super()
    this.lines = lines
  }

  balanceReflow() {
    const { lines } = this
    const flowOneDown = (tmpMwss, idx) =>
                              tmpMwss[idx + 1].unshift(tmpMwss[idx].pop())

    // Flow down from the maxLenLine
    while (!this.isBalanced) {
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

  equalReflow(len = Infinity) {
    const { lines } = this
    if (!lines.length) return

    const sw = min(lines.map(line => line.sw))
    const maxOfMws = max(flatten(lines.map(line => line.mws)))
    const maxLen = Math.floor(sw / maxOfMws)
    const avgLen = Math.ceil(sum(lines.map(line => line.len)) / lines.length)
    len = Math.min(len, maxLen, avgLen)

    // Note: the section lines might grow..
    let i = 0, line, nextLine
    const updateLine = () => {
      line = lines[i], nextLine = lines[i + 1]
      if (line.len > len && !nextLine) {
        nextLine = new FlowDataLine(line.sw)
        lines.push(nextLine)
      }
    }
    const flowOneDown = line => {
      nextLine.mws.unshift(line.mws.pop())
      nextLine.ws.unshift(line.ws.pop())
      nextLine.measures.unshift(line.measures.pop())
    }

    updateLine()
    while (nextLine) {
      while (line.len > len) flowOneDown(line)
      i++
      updateLine()
    }

    // Set ws.
    lines.forEach(line => {
      const len = max(lines.map(line => line.len))
      const width = line.sw / len
      line.ws = line.ws.map(() => width)
    })
  }

  findMaxLenLineIndex() {
    const { maxLen } = this
    return findIndexRight(this.lines, line => line.len === maxLen)
  }

  // Update mws & ws & measures by tmpMwss.
  updateLines(tmpMwss) {
    const { lines } = this
    lines.forEach((line, i) => {
      line.mws = tmpMwss[i]
      line.ws = line.mws.slice()
    })
    for (let i = 0; i < lines.length - 1; i++) {
      const line = lines[i], nextLine = lines[i + 1]
      while (line.measures.length > line.mws.length) {
        nextLine.measures.unshift(line.measures.pop())
      }
    }
  }
}
