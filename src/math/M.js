import Expression from './Expression'

const M = (expr, idents) => new Expression(expr, idents).result
export default M

const { log } = console
const { concat } = []
const isNum = num => !isNaN(num) && isFinite(num)
const makeNameFunc = names => names.map(name => ({ name, func: Math[name] }))

makeNameFunc([
  'min', 'max'
]).forEach(({ name, func }) => {
  M[name] = function (arr) {
    arr = concat.apply([], arr)
    return func.apply(null, arr)
  }
})

makeNameFunc([
  'sin', 'cos', 'tan', 'cot', 'sec', 'cos',
  'round',
  'log'
]).forEach(({ name, func }) => { M[name] = arr => arr.map(func) })

M.clone = arr => arr.map(v => v)

M.print = function () {
  const list = ['M.print:']
  for (let i = 0; i < arguments.length; i++) {
    let x = arguments[i]
    if (typeof x === 'number') x = [x]
    // if (Array.isArray(x)) x = M('round(x * 1e5) / 1e5', {x})
    list.push(x)
  }
  log.apply(null, list)
}

M.range = (a, step, b) => {
  const result = []
  for (let i = a; i <= b; i += step) result.push(i)
  return result
}

M.repeat = (num, rep) => M.range(0, 1, rep).map(() => num)

M.limit = arr => {
  const min = M.min(arr), max = M.max(arr)
  return { min, max, range: max - min }
}

M.dataLimit = dataset => {
  const x = dataset.map(data => data.x)
  const y = dataset.map(data => data.y)
  return { x: M.limit(x), y: M.limit(y) }
}

M.cleanData = dataset => {
  const clean = ({ x, y }) => {
    const nx = [], ny = []
    x.forEach((xi, i) => {
      if (isNum(xi) && isNum(y[i])) { nx.push(xi); ny.push(y[i]) }
    })
    return { x: nx, y: ny }
  }
  return dataset.map(clean)
}
