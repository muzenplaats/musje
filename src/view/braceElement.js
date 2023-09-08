import el from '../utils/el'
import box from './box'
import pathD from '../math/pathD'

// Shape dapted from MuseScore 3.0.

const normXs = [
  0.923, 0.923, 0.334, 0.334, 0.334, 0.495, 0.990, 0.997, 1.00, 1.00, 1.00, 0.963, 0.936, 0.923, 0.900, 0.883, 0.241, 0.0268, 0.0268, 0.0268, 0.656, 0.656, 0.656, 0.495, 0.00, 0.00, 0.00, 0.495, 0.656, 0.656, 0.656, 0.0268, 0.0268, 0.0268, 0.241, 0.883, 0.900, 0.923, 0.936, 0.963, 1.00, 1.00, 1.00, 0.997, 0.990, 0.495, 0.334, 0.334, 0.334, 0.923, 0.923, 0.923, 0.709, 0.0803, 0.709, 0.923, 0.923
]

const normYs = [
  0.354, 0.273, 0.194, 0.116, 0.0763, 0.0382, 0.00399, 0.00356, 0.00285, 0.00242, 0.00114, 0.00, 0.00, 0.00, 0.000143, 0.00114, 0.0450, 0.0957, 0.147, 0.229, 0.309, 0.388, 0.428, 0.465, 0.499, 0.500, 0.501, 0.535, 0.572, 0.612, 0.691, 0.770, 0.853, 0.904, 0.955, 0.999, 1.00, 1.00, 1.00, 1.00, 0.999, 0.998, 0.997, 0.996, 0.996, 0.962, 0.924, 0.884, 0.806, 0.727, 0.646, 0.594, 0.544, 0.500, 0.456, 0.406, 0.354
]

const transformXs = (x0, width, strokeWidth) => {
  // Todo: strokeWidth
  // xs[0-25], xs[25-56]

  return normXs.map(x => x0 + x * width)
}

const transformYs = (y0, height) => normYs.map(y => y0 + y * height)


export default function braceElement(braceLayout) {
  const { x, y, width, height, strokeWidth } = braceLayout

  const xs = transformXs(x, width, strokeWidth)
  const ys = transformYs(y, height)

  return el.create('g', [
    // box(braceLayout, 'green'),

    el('path', {
      d: pathD()
        .moveTo(xs[0], ys[0])
        .curveTo(xs[1], ys[1], xs[2], ys[2], xs[3], ys[3])
        .curveTo(xs[4], ys[4], xs[5], ys[5], xs[6], ys[6])
        .curveTo(xs[7], ys[7], xs[8], ys[8], xs[9], ys[9])
        .curveTo(xs[10], ys[10], xs[11], ys[11], xs[12], ys[12])
        .curveTo(xs[13], ys[13], xs[14], ys[14], xs[15], ys[15])
        .curveTo(xs[16], ys[16], xs[17], ys[17], xs[18], ys[18])
        .curveTo(xs[19], ys[19], xs[20], ys[20], xs[21], ys[21])
        .curveTo(xs[22], ys[22], xs[23], ys[23], xs[24], ys[24])
        .lineTo(xs[25], ys[25])
        .lineTo(xs[26], ys[26])
        .curveTo(xs[27], ys[27], xs[28], ys[28], xs[29], ys[29])
        .curveTo(xs[30], ys[30], xs[31], ys[31], xs[32], ys[32])
        .curveTo(xs[33], ys[33], xs[34], ys[34], xs[35], ys[35])
        .curveTo(xs[36], ys[36], xs[37], ys[37], xs[38], ys[38])
        .curveTo(xs[39], ys[39], xs[40], ys[40], xs[41], ys[41])
        .curveTo(xs[42], ys[42], xs[43], ys[43], xs[44], ys[44])
        .curveTo(xs[45], ys[45], xs[46], ys[46], xs[47], ys[47])
        .curveTo(xs[48], ys[48], xs[49], ys[49], xs[50], ys[50])
        .curveTo(xs[51], ys[51], xs[52], ys[52], xs[53], ys[53])
        .curveTo(xs[54], ys[54], xs[55], ys[55], xs[56], ys[56]),
      style: 'fill: black'
    }),
  ])
}
