const { concat } = []

export const flatten = arr => concat.apply([], arr)
export const repeat = (rep, num) => new Array(num + 1).join(rep)
export const lastItem = arr => arr[arr.length - 1]
export const max = arr => Math.max.apply(null, arr)
export const sum = arr => arr.reduce((a, b) => a + b)

export const range = num => {
  const result = []
  for (let i = 0; i < num; i++) result.push(i)
  return result
}

export const arrayToSet = arr => {
  const result = {}
  arr.forEach(name => { result[name] = true })
  return result
}

export const swapObject = obj => {
  const result = {}
  for (let key in obj) result[obj[key]] = key
  return result
}

const { slice } = []
export function makeToJSON() {
  const list = ['name'].concat(slice.apply(arguments))
  return function () {
    const result = {}
    list.forEach(key => { result[key] = this[key] })
    return result
  }
}
