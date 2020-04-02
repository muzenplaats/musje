/* 金錢卦 */

// 擲
const drop = () => Math.floor(Math.random() * 2) || -1    // 1: 正 -1: 反

// 三擲
const drop3 = () => {
  const sum = drop() + drop() + drop()

  switch (sum) {
    case 3:
      return 9  // 正正正 (1/8) -> 老陽
    case 1:
      return 7  // 正正反 (3/8) -> 少陽
    case -1:
      return 8  // 正反反 (3/8) -> 少陰
    case -3:
      return 6  // 反反反 (1/8) -> 老陰
  }
}

// 卜：六擲
const drop6 = () => [0, 0, 0, 0, 0, 0].map(drop3)

const sum = arr => arr.reduce((a, b) => a + b, 0)

// 之卦爻位 in 0-based index
const getWhichOf = arr => {
  var place = (55 - sum(arr) - 1) % 12
  if (place >= 6) place = 11 - place
  return place
}

const getFundamental = arr => arr.map(num => num % 2)

const getOfAns = arr => {
  const whichOf = getWhichOf(arr)
  const num = arr[whichOf]

  if (num === 6 || num === 9) {
    const result = getFundamental(arr)
    result[whichOf] = num === 6 ? 1 : 0
    return result
  }
}

// =======================================================================

const ans = drop6()
const fundamental = getFundamental(ans)
const ofAns = getOfAns(ans)
const ansGua = new Gua(gua(fundamental.join('')))

console.log(ans, fundamental, ofAns, sum(ans), getWhichOf(ans))

const ofGua = ofAns ? new Gua(gua(ofAns.join(''))) : undefined

if (ofGua) {
  console.log(ansGua.name + '之' + ofGua.name)
  console.log(ansGua, ofGua)
} else {
  console.log(ansGua.name, ansGua)
}
