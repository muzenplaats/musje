import MeasureLayout from './MeasureLayout'

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
      this.lines.push(new FlowDataLine(sw))
    })
    this.set('mws', 'measureMinWidths', list)
    this.set('measures')
    this.set('ws')
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
}

class FlowDataLine {
  constructor(sw) {
    this.mws = []
    this.sw = sw            // systemWidth
  }

  get len() { return this.mws.length }
}
