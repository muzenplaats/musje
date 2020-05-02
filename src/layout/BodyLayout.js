import AbstractLayout from './AbstractLayout'
import SystemHeadLayout from './SystemHeadLayout'
import SystemLayout from './SystemLayout'
import MeasureLayout from './MeasureLayout'
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
    // console.log(this.createSystemHeadLayout())
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

  createSystemHeadLayout(nameType = 'abbreviation') {
    const head = {
      nameType,   // full | abbreviation
      partHeads: this.parts.map(part => part.head)
    }
    return new SystemHeadLayout(head, this.style)
  }

  makeSystemsLayouts() {
    const systemWidth = this.width
    const minWidths = this.measures
          .map(measure => new MeasureLayout(measure, this.style))
          .map(MeasureLayout => MeasureLayout.minWidth)
    const fullHeadWidth = this.createSystemHeadLayout('full').width
    const abbrHeadWidth = this.createSystemHeadLayout('abbreviation').width

    const sysWidths = []
    let currW = fullHeadWidth

    minWidths.forEach((minW, m) => {
      currW += minW
      if (currW === systemWidth) {
        sysWidths.push(m + 1)
        currW = abbrHeadWidth
      } else if (currW > systemWidth) {
        sysWidths.push(m)
        currW = abbrHeadWidth + minW
      }
    })

    if (lastItem(sysWidths) !== minWidths.length) {
      sysWidths.push(minWidths.length)
    }
    for (let i = sysWidths.length - 1; i > 0; i--) {
      sysWidths[i] = sysWidths[i] - sysWidths[i - 1]
    }

    console.log(sysWidths)

    this.systemsLayouts = []
    let begin = 0, end
    sysWidths.forEach((sysWidth, sys) => {
      end = begin + sysWidth
      const measures = this.measures.slice(begin, end)
      const headLayout =
              this.createSystemHeadLayout(sys ? 'abbreviation' : 'full')
      const systemLayout = new SystemLayout(headLayout, measures, this.style)
      systemLayout.width = this.width
      this.systemsLayouts.push(systemLayout)
      begin = end
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
            const { tieLayout, beginSlursLayouts, endSlursLayouts } = layout
            if (tieLayout) assignSys(tieLayout)
            if (beginSlursLayouts) {
              beginSlursLayouts.forEach(layout => assignSys(layout))
            }
            if (endSlursLayouts) {
              endSlursLayouts.forEach(layout => assignSys(layout))
            }
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
