import { el } from './html'

export default function jsonElement(name, value) {
  if (!value) { value = name; name = '*' }
  value = JSON.parse(JSON.stringify(value))
  return el.create('ul', [compond(name, value)])
}

const number = (name, value) => {
  return el('li', [
    el('span', name),
    el('span', { style: 'color: red' }, value)
  ])
}
const string = (name, value) => {
  return el('li', [
    el('span', name),
    el('span', { style: 'color: green' }, value)
  ])
}
const boolean = (name, value) => {
  return el('li', [
    el('span', name),
    el('span', { style: 'color: blue' }, value)
  ])
}
const nullel = (name, value) => {
  return el('li', [
    el('span', name),
    el('span', { style: 'color: navy' }, value)
  ])
}

const array = (name, value) => {
  return el('li', [
    el('span', name),
    el('ul', value.map((val, i) => compond(i, val)))
  ])
}

const object = (name, value) => {
  return el('li', [
    el('span', name),
    el('ul', Object.keys(value).map(key => compond(key, value[key])))
  ])
}

const compond = (name, value) => {
  if (typeof value === 'number') return number(name, value)
  if (typeof value === 'string') return string(name, value)
  if (typeof value === 'boolean') return boolean(name, value)
  if (value === null) return nullel(name, value)
  if (Array.isArray(value)) return array(name, value)
  if (typeof value === 'object') return object(name, value)
}
