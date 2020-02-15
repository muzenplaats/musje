
export const repeat = (rep, num) => new Array(num + 1).join(rep)

const { slice } = []
export function makeToJSON() {
  const list = ['name'].concat(slice.apply(arguments))
  return function () {
    const result = {}
    list.forEach(key => { result[key] = this[key] })
    return result
  }
}
