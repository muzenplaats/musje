const makeOp = op => {
  return (x, y) => {
    if (typeof x === 'number') {
      if (typeof y === 'number') return op(x, y)
      return y.map(yi => op(x, yi))
    }
    if (typeof y === 'number') return x.map(xi => op(xi, y))
    return x.map((xi, i) => op(xi, y[i]))
  }
}

export const add = makeOp((a, b) => a + b)
export const sub = makeOp((a, b) => a - b)
export const mul = makeOp((a, b) => a * b)
export const div = makeOp((a, b) => a / b)
export const neg = x => sub(0, x)
