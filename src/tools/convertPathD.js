import { range, min, max } from '../utils/helpers'
import makeLexerClass from '../utils/makeLexerClass'

const Lexer = makeLexerClass({
  M: 'M',
  L: 'L',
  C: 'C',
  sep: '( +,?|,? +| *,|, *)',
  command: '[MLC]',
  number: '[\\d\\.]+'
})

// Taken from exported svg file by MuseScore 3.0.
const braceD = 'M329.071,910.304 C329.071,884.02 310.968,858.471 310.968,833.29 C310.968,820.608 315.905,808.293 331.128,797.265 C331.334,797.127 331.437,796.897 331.437,796.76 C331.437,796.346 330.305,795.978 329.482,795.978 C329.071,795.978 328.351,796.024 327.837,796.346 C308.088,810.499 301.505,826.857 301.505,843.4 C301.505,870.051 320.842,895.783 320.842,921.332 C320.842,934.014 315.905,945.962 300.682,956.99 L300.682,957.357 L300.682,957.725 C315.905,968.753 320.842,980.7 320.842,993.383 C320.842,1018.93 301.505,1044.66 301.505,1071.32 C301.505,1087.86 308.088,1104.22 327.837,1118.37 C328.351,1118.69 329.071,1118.74 329.482,1118.74 C330.305,1118.74 331.437,1118.37 331.437,1117.95 C331.437,1117.82 331.334,1117.59 331.128,1117.45 C315.905,1106.42 310.968,1094.11 310.968,1081.42 C310.968,1056.24 329.071,1030.69 329.071,1004.41 C329.071,987.685 322.488,971.694 303.151,957.357 C322.488,943.021 329.071,927.03 329.071,910.304'

const normalize = arr => {
  const minVal = min(arr)
  const maxVal = max(arr)
  return arr.map(val => ((val - minVal) / (maxVal - minVal)).toPrecision(3))
}

export default function convertPathD() {
  const lexer = new Lexer(braceD)
  let scriptStrs = ['pathD()']
  const xs = []
  const ys = []
  let index = 0

  while (lexer.is('command') && !lexer.eof) {
    if (lexer.is('M')) {
      lexer.token('M')
      lexer.token('number', lexeme => { xs.push(+lexeme)})
      lexer.token('sep')
      lexer.token('number', lexeme => { ys.push(+lexeme)})
      lexer.optional('sep')
      scriptStrs.push(`.moveTo(xs[${index}], ys[${index}])`)
      index++
    } else if (lexer.is('L')) {
      lexer.token('L')
      lexer.token('number', lexeme => { xs.push(+lexeme)})
      lexer.token('sep')
      lexer.token('number', lexeme => { ys.push(+lexeme)})
      lexer.optional('sep')
      scriptStrs.push(`.lineTo(xs[${index}], ys[${index}])`)
      index++
    } else if (lexer.is('C')) {
      lexer.token('C')
      let listStrs = []
      range(3).forEach(() => {
        lexer.token('number', lexeme => { xs.push(+lexeme)})
        lexer.token('sep')
        lexer.token('number', lexeme => { ys.push(+lexeme)})
        lexer.optional('sep')
        listStrs.push(`xs[${index}], ys[${index}]`)
        index++
      })
      scriptStrs.push(`.curveTo(${listStrs.join(', ')})`)
    }
  }

  // console.log(normalize(xs).map((x, i) => console.log(i, x)))

  return `
// Shape adapted from MuseScore 3.0.

const normXs = [${normalize(xs).join(', ')}]

const normYs = [${normalize(ys).join(', ')}]

const transformXs = (x0, width, strokeWidth) => {
  // Todo: strokeWidth
  return normXs.map(x => x0 + x * width)
}

const transformYs = (y0, height) => {
  return normYs.map(y => y0 + y * height)
}

const getBrace = (dxs, dys) => {
  return create('path', {
    d: ${scriptStrs.join('\n      ')},
    style: 'fill: black'
  })
}
`
}
