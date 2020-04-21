import AbstractLayout from './AbstractLayout'
import Layout from './Layout'

export default class BarLayout extends AbstractLayout {
  constructor(bar, style) {
    super()
    this.name = 'bar-layout'
    this.bar = bar
    this.style = style
    const { lightWidth, heavyWidth, lineHeight: height, dotSize,
            linesSep, lineDotSep } = style.bar

    this.lightSize = { width: lightWidth, height }
    this.heavySize = { width: heavyWidth, height }
    this.dotSize = { width: dotSize, height: dotSize, r: dotSize / 2 }

    const lh = () => lightWidth + linesSep + heavyWidth
    const lhd = () => lh() + lineDotSep + dotSize

    let size
    switch (bar.value) {
      case '|':
        size = this.lightSize; break
      case '||':
        size = { width: lightWidth * 2 + linesSep, height }; break
      case '|]':
        size =  { width: lh(), height }; break
      case ':|': // fall through
      case '|:':
        size = { width: lhd(), height }; break
      case ':|:':
        size = { width: 2 * lhd() - heavyWidth, height }; break
    }
    Object.assign(this, size, { dy: size.height })
  }

  set position(pos) {
    super.position = pos
    const { value } = this.bar
    const s = this.style.bar

    const { x, y, cy, x2 } = this
    const lightLayout = new Layout({ x, y }, this.lightSize)
    this.linesLayouts = []

    if (value === '|') {
      this.linesLayouts = [lightLayout]
    } else if (value === '||') {
      this.linesLayouts = [lightLayout, new Layout({ x2, y }, this.lightSize)]
    } else if (value === '|]') {
      this.linesLayouts = [lightLayout, new Layout({ x2, y }, this.heavySize)]
    } else if (value === ':|' || value === ':|:') {
      let x0 = x + s.dotSize / 2
      const dotYShift = (s.dotsSep + s.dotSize) / 2
      this.dotsLayouts = [
        new Layout({ x, cy: cy - dotYShift }, this.dotSize),
        new Layout({ x, cy: cy + dotYShift }, this.dotSize)
      ]
      x0 = x + s.dotSize + s.lineDotSep
      this.linesLayouts = [
        new Layout({ x: x0, y }, this.lightSize),
        new Layout({ x: x0 + s.lightWidth + s.linesSep, y }, this.heavySize),
      ]
      if (value === ':|:') {
        x0 += s.lightWidth + 2 * s.linesSep + s.heavyWidth
        this.linesLayouts.push(new Layout({ x: x0, y }, this.lightSize))
      }
    }
    if (value === '|:' || value === ':|:') {
      const dotYShift = (s.dotsSep + s.dotSize) / 2
      this.dotsLayouts = this.dotsLayouts || []
      this.dotsLayouts.push(
        new Layout({ x2, cy: cy - dotYShift }, this.dotSize),
        new Layout({ x2, cy: cy + dotYShift }, this.dotSize)
      )
      if (value === '|:') {
        this.linesLayouts = [
          new Layout({ x, y }, this.heavySize),
          new Layout({ x: x + s.heavyWidth + s.linesSep, y }, this.lightSize)
        ]
      }
    }
  }

  toJSON() {
    const { linesLayouts, dotsLayouts } = this
    return { ...super.toJSON(), linesLayouts, dotsLayouts }
  }
}
