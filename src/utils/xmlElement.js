import { el } from './html'
import Document from './XmlDocument'
import './xml-json-viewer.css'

export default function xmlElement(str) {
  const doc = new Document(str)
  const { xmlDecl, doctype, root } = doc

  return el.create('ul', { class: 'xml-viewer' }, [
    xmlDecl ? el('li', { class: 'xml-decl' }, [
      el('div', { class: 'xml-decl-name' }, 'xml'),
      attrsEl(xmlDecl.attrs)
    ]) : [],
    doctype ? el('li', { class: 'xml-doctype' }, [
      el('div', { class: 'xml-doctype-name'}, 'Doctype'),
      el('div', { class: 'xml-doctype-value'}, doctype.value)
    ]) : [],
    elementEl(root)
  ])
}

const elementEl = element => {
  return el('ul', { class: 'xml-element' }, [
    el('div', { class: 'xml-name-attrs' }, [
      el('div', { class: 'xml-el-name' }, element.elName),
      attrsEl(element.attrs)
    ]),
    element.mapChild(child => {
      if (typeof child === 'string') {
        return el('div', { class: `xml-el-value ${valueClass(child)}` }, child)
      }
      return el('li', [elementEl(child)])
    })
  ])
}

const attrsEl = attrs => {
  return el('div', { class: 'xml-attrs' }, attrs.map((value, name) => {
    return el('div', { class: 'xml-attr' }, [
      el('div', { class: 'xml-attr-name' }, name),
      el('div', { class: `xml-attr-value ${valueClass(value)}` }, value)
    ])
  }))
}

const valueClass = value => {
  if (isFinite(value)) return 'xml-number'
  if (/^(yes|no)$/.test(value)) return 'xml-boolean'
  return 'xml-string'
}
