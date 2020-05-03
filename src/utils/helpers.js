const { concat } = []

export const flatten = arr => concat.apply([], arr)
export const repeat = (rep, num) => new Array(num + 1).join(rep)
export const lastItem = arr => arr[arr.length - 1]
export const min = arr => Math.min.apply(null, arr)
export const max = arr => Math.max.apply(null, arr)
export const sum = arr => arr.reduce((a, b) => a + b)

export const toCamel = hyphenedName => {
  const words = hyphenedName.split('-')
  const first = words.shift()
  return [first]
    .concat(words.map(word => word[0].toUpperCase() + word.substr(1))).join('')
}

export const toCapitalCamel = hyphenedName => {
  const words = hyphenedName.split('-')
  return words.map(word => word[0].toUpperCase() + word.substr(1)).join('')
}

export const precision = (val, digits) => {
  val = +val
  const prec = val.toPrecision(digits)
  return Math.abs(val) > 1e6 ? prec : '' + (+prec)
}

// Range with begin inclusive and end exclusive.
export const range = (begin, end) => {
  if (end === undefined) { end = begin; begin = 0 }
  const result = []
  for (let i = begin; i < end; i++) result.push(i)
  return result
}

export const zeros = num => {
  const result = []
  for (let i = 0; i < num; i++) result.push(0)
  return result
}

export const arrayToSet = arr => {
  const result = {}
  arr.forEach(name => { result[name] = true })
  return result
}

export const setToArray = set => Object.keys(set)

export const unique = arr => setToArray(arrayToSet(arr))

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

const el = (name, attrs, content) => {
  const elm = document.createElementNS('http://www.w3.org/2000/svg', name)
  for (let aname in attrs) elm.setAttribute(aname, attrs[aname])
  if (content.appendChild) { elm.appendChild(content) }
  else { elm.textContent = content }
  return elm
}
let txt
const cache = {}
const getText = () => {
  if (txt) return txt
  txt = el('text', { x: 0, y: 50 }, '')
  const svg = el('svg', { width: 0, height: 0 }, txt)
  document.body.appendChild(svg)
  return txt
}
export const getSize = (font, content) => {
  const key = font + content
  if (cache[key]) return cache[key]
  getText()
  const style = `font-family: ${font.family}; font-size: ${font.size}`
  txt.setAttribute('style', style)
  txt.textContent = content
  const { width, height } = txt.getBBox()
  const result = { width, height }
  cache[key] = result
  return result
}

export const loadText = (url, onsuccess) => {
  const xhr = new XMLHttpRequest()
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) onsuccess(xhr.responseText)
    }
  }
  xhr.open('GET', url, true)
  xhr.send(null)
}
