import AbstractLayout from './AbstractLayout'
import SystemHeadLayout from './SystemHeadLayout'
import SystemLayout from './SystemLayout'
import MeasureLayout from './MeasureLayout'
import FlowData from './FlowData'
import { lastItem, sum } from '../utils/helpers'

export default class BodyLayout extends AbstractLayout {
  constructor(body, style) {
    super()
    this.name = 'body-layout'
    this.parts = body.parts
    this.measures = body.measures
    this.style = style
    this.setWidth()
    this.makeSystemsLayouts()
    this.markCurvesSys()
    this.markLyricsSys()
    this.setHeight()
  }

  setWidth() {
    const { width, marginLeft, marginRight } = this.style.score
    this.width = width - marginLeft - marginRight
  }

  setHeight() {
    const { systemsLayouts } = this
    this.height = systemsLayouts.length ?
            (sum(systemsLayouts.map(layout => layout.height)) +
            (systemsLayouts.length - 1) * this.style.body.systemsSep) : 0
  }

  createSystemHeadLayout(nameType) {
    const head = {
      nameType,
      partHeads: this.parts.map(part => part.head)
    }
    const measure = this.measures[0]
    if (measure) head.partsToCellsIndices = measure.partsToCellsIndices
    return new SystemHeadLayout(head, this.style)
  }

  makeSystemsLayouts() {
    const flowData = this.flowSystems()

    this.systemsLayouts = []

    flowData.lines.forEach((line, sys) => {
      const headLayout =
              this.createSystemHeadLayout(sys ? 'abbreviation' : 'full')
      const { measures } = line
      const systemLayout = new SystemLayout(headLayout, measures, this.style)
      systemLayout.width = this.width
      this.systemsLayouts.push(systemLayout)
    })
  }

  flowSystems() {
    const systemWidth = this.width
    const fullHeadWidth = this.createSystemHeadLayout('full').width
    const abbrHeadWidth = this.createSystemHeadLayout('abbreviation').width
    const data = new FlowData({
      measures: this.measures,
      fhsw: systemWidth - fullHeadWidth,
      ahsw: systemWidth - abbrHeadWidth,
      style: this.style
    })
    const { measureMinWidths } = data

    const sysLengths = []
    let currW = fullHeadWidth

    measureMinWidths.forEach((minW, m) => {
      currW += minW
      if (currW === systemWidth) {
        sysLengths.push(m + 1)
        currW = abbrHeadWidth
      } else if (currW > systemWidth) {
        sysLengths.push(m)
        currW = abbrHeadWidth + minW
      }
    })

    if (lastItem(sysLengths) !== measureMinWidths.length) {
      sysLengths.push(measureMinWidths.length)
    }

    for (let i = sysLengths.length - 1; i > 0; i--) {
      sysLengths[i] = sysLengths[i] - sysLengths[i - 1]
    }

    // console.log(sysLengths)
    // return sysLengths

    data.lens = sysLengths
    // console.log(data)
    console.log(data.lens)

    return data
  }

  markCurvesSys() {
    this.systemsLayouts.forEach((systemLayout, s) => {
      systemLayout.measuresLayouts.forEach(measureLayout => {
        measureLayout.cellsLayouts.forEach((cellLayout, c) => {
          const assignSys = layout => {
            layout.systemLayout = systemLayout
            layout.sys = s
            layout.c = c
          }
          cellLayout.dataLayout.layouts.forEach(layout => {
            const { tieLayout, beginSlursLayouts, endSlursLayouts,
                    chord } = layout
            if (tieLayout) assignSys(tieLayout)
            if (beginSlursLayouts) {
              beginSlursLayouts.forEach(layout => assignSys(layout))
            }
            if (endSlursLayouts) {
              endSlursLayouts.forEach(layout => assignSys(layout))
            }
            if (chord) layout.pitchesLayout.layouts.forEach(playout => {
              if (playout.tieLayout) assignSys(playout.tieLayout)
            })
          })
        })
      })
    })
  }

  markLyricsSys() {
    this.systemsLayouts.forEach((systemLayout, s) => {
      systemLayout.measuresLayouts.forEach(measureLayout => {
        measureLayout.cellsLayouts.forEach(cellLayout => {
          cellLayout.dataLayout.layouts.forEach(layout => {
            const { lyricsLayouts } = layout
            if (lyricsLayouts) lyricsLayouts.forEach(lo => { lo.sys = s })
          })
        })
      })
    })
  }

  set position(pos) {
    super.position = pos
    const { systemsSep } = this.style.body
    let { x, y } = this
    this.systemsLayouts.forEach(layout => {
      layout.position = { x, y }
      y += layout.height + systemsSep
    })
  }

  toJSON() {
    const { systemsLayouts } = this
    return { ...super.toJSON(), systemsLayouts }
  }
}
