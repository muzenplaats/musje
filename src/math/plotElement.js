import el from '../utils/el'
import box from '../view/box'
import M from './M'
import Rect from './Rect'
import Coordinate from './Coordinate'
import pathD from './pathD'
// import './UnitValue'

export default function plotElement() {

// -- data -----------------------------------------------------
  let x = M.range(0, 0.2, 20)
  let ysin = M('sin(x)', {x})
  let ycos = M('cos(x)', {x})
  let ylog = M('log(x)', {x})

  let dataset = [
    { x, y: ysin }, { x, y: ycos }, { x, y: ylog }
  ]
// -------------------------------------------------------------

  dataset = M.cleanData(dataset)
  const lim = M.dataLimit(dataset)
  const rect = new Rect({ x1: 70, y1: 50, width: 700, height: 200 })
  const coor = new Coordinate(lim, rect)
  dataset = coor.transformDataset(dataset)

  const title = { x: rect.cx, y: rect.y1 - 20, text: 'sin(x)' }
  const xlabel = { x: rect.cx, y: rect.y2 + 30, text: 'x' }
  const ylabel = { x: rect.x1 - 50, y: rect.cy, text: 'y' }

  const xAxis = {
    axis: coor.lines({ x: [0, 20], y: [-1, -1] }),
    majorTicks: coor.vlines({ x: [0, 5, 20], y: -1, height: 12 }),
    minorTicks: coor.vlines({ x: [0, 1, 20], y: -1, height: 5 }),
    numbers: coor.xnums({ x: [0, 5, 20], y: -1 - 0.5 }),
    label: coor.text({ x: 0, y: 0, content: 'x' })
  }

  let majorXTicks = coor.vlines({ x: [0, 5, 20], y: -1, height: 12 })
  let minorXTicks = coor.vlines({ x: [0, 1, 20], y: -1, height: 5 })
  const xTickNums = coor.xnums({ x: [0, 5, 20], y: -1 - 0.5 })

  let majorYTicks = coor.hlines({ x: 0, y: [-1, 0.5, 1], width: 12 })
  let minorYTicks = coor.hlines({ x: 0, y: [-1, 0.125, 1], width: 5 })
  const yTickNums = coor.ynums({ x: 0 - 0.5, y: [-1, 0.5, 1] })

  majorXTicks = pathD().lines(majorXTicks)
  minorXTicks = pathD().lines(minorXTicks)
  majorYTicks = pathD().lines(majorYTicks)
  minorYTicks = pathD().lines(minorYTicks)
  const lines = pathD().lines(dataset)
  const axis = pathD().lines(xAxis.axis)
  // M.print(axis)


  const style = `
    fill: none
    stroke-width: 1
    stroke: black
  `

  return el.create('svg', { width: 800, height: 300 }, [
    el('text', { x: title.x, y: title.y }, title.text),
    // box(rect, 'orange'),

    // x-axis
    el('path', { d: axis, style }),
    el('path', { d: minorXTicks, style }),
    el('path', { d: majorXTicks, style }),
    xTickNums.map(num => {
      return el('text', {
        x: num.x, y: num.y, style: 'text-anchor: middle'
      }, num.text)
    }),
    el('text', {
      x: xlabel.x, y: xlabel.y, style: 'text-anchor: middle'
    }, xlabel.text),

    // y-axis
    el('path', { d: minorYTicks, style }),
    el('path', { d: majorYTicks, style }),
    yTickNums.map(num => {
      return el('text', {
        x: num.x, y: num.y, style: 'text-anchor: middle'
      }, num.text)
    }),
    el('text', {
      x: ylabel.x, y: ylabel.y, style: 'text-anchor: middle',
      transform: `rotate(-90, ${ylabel.x}, ${ylabel.y})`
    }, ylabel.text),

    // data
    el('path', { d: lines, style })
  ])
}
