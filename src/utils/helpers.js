
export const arrayToSet = arr => {
  const result = {}
  arr.forEach(name => { result[name] = true })
  return result
}

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

export const load = filename => {
  const xhttp = new XMLHttpRequest()
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
         // Typical action to be performed when the document is ready:
         document.getElementById('demo').innerHTML = xhttp.responseText
      }
  }
  xhttp.open('GET', 'filename', true)
  xhttp.send()
}
