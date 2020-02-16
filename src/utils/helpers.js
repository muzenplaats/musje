
export const repeat = (rep, num) => new Array(num + 1).join(rep)

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
