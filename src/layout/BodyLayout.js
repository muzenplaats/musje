import AbstractLayout from './AbstractLayout'
import SystemHeadLayout from './SystemHeadLayout'
import SystemLayout from './SystemLayout'
import MeasureLayout from './MeasureLayout'
import FlowData from './FlowData'
import { lastItem, sum, range } from '../utils/helpers'

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
    const { align } = this.style.system
    const flowData = this.flowSystems()

    if (align === 'justify') {
      this.balanceSystems(flowData)
      flowData.lines.forEach(line => line.optimizeMeasureWidths())
    } else if (align === 'equal') {
      this.equalizeSystems(flowData)
    }

    this.systemsLayouts = []

    flowData.lines.forEach((line, sys) => {
      const headLayout =
              this.createSystemHeadLayout(sys ? 'abbreviation' : 'full')
      const { measures } = line
      const systemLayout = new SystemLayout(headLayout, measures, this.style)
      systemLayout.width = this.width
      this.systemsLayouts.push(systemLayout)
    })

    if (align === 'justify' || align === 'equal') {
      this.systemsLayouts.forEach((systemLayout, sys) => {
        systemLayout.measuresLayouts.forEach((measureLayout, m) => {
          const width = flowData.lines[sys].ws[m]
          measureLayout.reflow(width)
        })
      })
    }
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

    data.lens = sysLengths

    // console.log(data.lens)

    return data
  }

  balanceSystems(flowData) {
    if (flowData.isBalanced) return

    const sections = flowData.obstacleSectioning()
    sections.forEach(section => section.balanceReflow())
  }

  // Make the systems with the same amount of measures; leave the last unclosed.
  equalizeSystems(flowData) {
    const length = Infinity   // for future usage
    const sections = flowData.obstacleSectioning()
    sections.forEach(section => section.equalReflow(length))
    flowData.mergeSections(sections)
    flowData.lines.forEach(line => {
      if (line.isObstacle) line.optimizeMeasureWidths()
    })
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
