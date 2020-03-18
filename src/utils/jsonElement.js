import { el } from './html'
import './xml-json-viewer.css'

export default function jsonElement(name, value) {
  if (!value) { value = name; name = '*' }
  value = JSON.parse(JSON.stringify(value))
  return el.create('ul', { class: 'json-viewer' }, [compond(name, value)])
}

const nameEl = name => {
  let classNames = 'json-name'
  if (/^\[\d+\]/.test(name)) classNames += ' json-array-name'
  return el('div', { class: classNames }, name)
}
const number = (name, value) => {
  return el('li', [
    nameEl(name),
    el('span', { class: 'json-number' }, value)
  ])
}
const string = (name, value) => {
  return el('li', [
    nameEl(name),
    el('span', { class: 'json-string' }, value)
  ])
}
const boolean = (name, value) => {
  return el('li', [
    nameEl(name),
    el('span', { class: 'json-boolean' }, value)
  ])
}
const nullel = (name, value) => {
  return el('li', [
    nameEl(name),
    el('span', { class: 'json-null' }, value)
  ])
}

const array = (name, value) => {
  return el('li', [
    nameEl(name + ': Array []'),
    el('ul', value.map((val, i) => compond(`[${i}]`, val)))
  ])
}

const getObjType = obj => {
  const t = obj.name
  return t ? t[0].toUpperCase() + t.substr(1) : ''
}

const object = (name, value) => {
  return el('li', [
    nameEl(`${name}: ${getObjType(value)} {}`),
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