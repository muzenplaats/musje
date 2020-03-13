import { el } from './html'
import Document from './XmlDocument'

export default function xmlElement(str) {
  const doc = new Document(str)
  const { xmlDecl, doctype, root } = doc
  const rootEl = elementEl(root)

  return el.create('ul', { class: 'xml-viewer' }, [
    xmlDecl ? el('li', { class: 'xml-decl' }, [
      el('div', { class: 'xml-delc-name' }, 'xml'),
      attrsEl(xmlDecl.attrs)
    ]) : [],
    doctype ? el('li', doctype.value) : [],
    rootEl
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
        return el('li', { class: valueClass(child)}, child)
      }
      return el('li', [elementEl(child)])
    })
  ])
}

const attrsEl = attrs => {
  return el('div', { class: 'xml-attrs' }, attrs.map((value, name) => {
    return el('div', { class: 'xml-attr' }, [
      el('div', { class: 'xml-attr-name' }, name),
      el('div', { class: valueClass(value) }, value)
    ])
  }))
}

const valueClass = value => {
  if (isFinite(value)) return 'xml-number'
  if (/^(yes|no)$/.test(value)) return 'xml-boolean'
  return 'xml-string'
}
