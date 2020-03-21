import { arrayToSet, unique, makeToJSON, repeat, flatten } from './helpers'

const EVENT_TYPES = arrayToSet([
  /* mouse */ 'mousedown', 'mouseup', 'click', 'dblclick', 'mousemove',
              'mouseover', 'mousewheel', 'mouseout', 'contextmenu',
  /* touch */ 'touchstart', 'touchmove', 'touchend', 'touchcancel',
  /* keyboard */ 'keydown', 'keypress', 'keyup',
  /* form */ 'focus', 'blur', 'change', 'submit',
  /* window */ 'scroll', 'resize', 'hashchange', 'load', 'unload',
  'input'
])
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'
const SVG_ELEMENT_NAMES = arrayToSet([
  'a', 'animate', 'animateMotion', 'animateTransform',
  'circle', 'clipPath', 'color-profile',
  'defs', 'desc', 'discard',
  'ellipse',
  'feBlend', 'feColorMatrix', 'feComponentTransfer', 'feComposite',
  'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap',
  'feDistantLight','feDropShadow', 'feFlood',
  'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR',
  'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode', 'feMorphology',
  'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight',
  'feTile', 'feTurbulence', 'filter', 'foreignObject',
  'g',
  'hatch', 'hatchpath',
  'image',
  'line', 'linearGradient',
  'marker', 'mask', 'mesh', 'meshgradient', 'meshpatch', 'meshrow',
  'metadata', 'mpath',
  'path', 'pattern', 'polygon', 'polyline',
  'radialGradient', 'rect',
  'script', 'set', 'solidcolor', 'stop', 'style', 'svg', 'switch', 'symbol',
  'text', 'textPath', 'title', 'tspan',
  'unknown', 'use',
  'view'
])

export class Element {
  constructor(element, level = 0, indent = 2) {
    this.name = 'element'
    this.level = level
    this.indent = indent

    this.elName = element.elName
    this.attrs = new Attrs(element.attrs)
    this.content = []
    element.content.forEach(child => {
      if (typeof child === 'undefined') {
        this.content.push('undefined')
      } else if (child === null) {
        this.content.push('null')
      } else if (child.name === 'element') {
        this.content.push(new Element(child, level + 1, indent))
      } else {
        this.content.push(child)
      }
    })
  }

  eachChild(cb) { this.content.forEach(cb) }
  eachAttr(cb) { this.attrs.each(cb) }

  create() {
    const { elName, content } = this
    const element = SVG_ELEMENT_NAMES[elName] ?
                    document.createElementNS(SVG_NAMESPACE, elName) :
                    document.createElement(elName)

    this.eachAttr((value, name) => {
      if (EVENT_TYPES[name]) {
        element.addEventListener(name, value)
      } else if (name === 'value') {
        if (typeof value === 'function') {
          value(element)
          element.addEventListener('input', () => {
            value.data[value.dname] = element.value
          })
        } else {
          element.value = value
        }
      } else if (name === 'style') {
        if (/\n/.test(value)) {
          value = value.trim().replace(/ *\n */g, ';')
        }
        element.setAttribute(name, value)
      } else {
        element.setAttribute(name, value)
      }
    })

    this.eachChild(child => {
      if (child instanceof Element) {
        element.appendChild(child.create())
      } else if (typeof child === 'object') {
        if ('html' in child) {
          if (typeof child.html === 'function') {
            child.html(element, 'html')
          } else {
            element.innerHTML = child.html
          }
        } else {
          element.appendChild(child)   // DOM Element
        }
      } else if (typeof child === 'function') {
        child(element)
      } else {
        element.textContent = child
      }
    })
    return element
  }

  toString() {
    const { level, indent, elName, attrs, content } = this
    const strs = []
    if (level > 0) strs.push('\n' + repeat(' ', level * indent))
    strs.push(`<${elName}`)
    if (attrs.hasAttr) strs.push(' ' + attrs)
    if (content.length === 0) {
      strs.push('/>')
    } else if (content[0].name !== 'element') {
      strs.push(`>${content}</${elName}>`)
    } else {
      strs.push('>', content.join(''))
      strs.push('\n', repeat(' ', level * indent), `</${elName}>`)
    }
    return strs.join('')
  }

  toJSON = makeToJSON('elName', 'attrs', 'content')
}

export class Attrs {
  constructor(attrs = {}) {
    this.name = 'attrs'
    this.value = attrs
  }

  get hasAttr() { return Object.keys(this.value).length > 0 }

  each(cb) {
    const { value } = this
    Object.keys(value).forEach((name, i) => cb(value[name], name, i))
  }

  toString() {
    const strs = []
    for (let name in this.value) strs.push(`${name}="${this.value[name]}"`)
    return strs.join(' ')
  }

  toJSON = makeToJSON('value')
}

export const el = (elName, attrs = {}, content = []) => {
  if (!Array.isArray(content)) content = [content]
  if (typeof attrs !== 'object') attrs = [attrs]
  if (Array.isArray(attrs)) { content = attrs; attrs = {} }
  content = flatten(content)
  return { name: 'element', elName, attrs, content }
}
el.create = (elName, attrs, content) => {
  return new Element(el(elName, attrs, content)).create()
}
el.html = (elName, attrs, content) => {
  if (typeof content === 'undefined') { content = attrs; attrs = {} }
  return el(elName, attrs, { html: content })
}

const configDeps = data => {
  const tmpData = {}, defaultData = {}
  const names = Object.keys(data)
  names.forEach(name => {
    const val = data[name]
    const _name = `_${name}`
    const { get, el } = val
    if (get || el) {
      Object.defineProperty(tmpData, name, {
        get() {
          return _name in this ? this[_name] :
                                (this[_name] = (get || el).apply(this))
        }
      })
    } else {
      tmpData[name] = val
    }
  })
  names.forEach(name => { defaultData[name] = tmpData[name] })

  const detector = { $collector: [] }
  names.forEach(name => {
    const _name = `_${name}`
    Object.defineProperty(detector, name, {
      get() {
        this.$collector.push(name)
        return _name in this ? this[_name] : defaultData[name]
      },
      set(val) { this[_name] = val }
    })
  })
  names.forEach(name => {
    let { get, el, dep } = data[name]
    if (get || el) (get || el).apply(detector)
    dep = unique(detector.$collector.concat(dep || []))
    detector.$collector.length = 0
    if (dep.length) data[name].dep = dep
    // console.log(name, dep)
  })
}

class Data {
  constructor(data) {
    configDeps(data)
    Object.assign(this, data)
    this.cacheElements = {}
    this.depGetters = {}
    this.makeConnectors()
  }

  makeConnectors() {
    Object.keys(this).forEach(name => {
      if (name === 'cacheElements' || name === 'depGetters') return
      if (this.hasOwnProperty(name)) {
        this.cacheElements[name] = []
        this[`$${name}`] = this.makeConnector(name)
        this.makeAccessor(name)
      }
    })
  }

  makeConnector(name) {
    if (this[name].el) return this.makeElConnector(name)

    const that = this
    const funct = (element, type) => {
      const index = that.cacheElements[name].length
      that.cacheElements[name].push(element)
      if (type) {
        const tname = `_${name}_html`
        that [tname] = that[tname] || []
        that[tname][index] = true
      }
      that[name] = that[name]   // duplicate calls
    }
    funct.data = this
    funct.dname = name
    return funct
  }

  makeElConnector(name) {
    const that = this
    return parent => {
      that.cacheElements[name].push({ parent, child: null })
      // that[name] = that[name]   // duplicate calls
    }
  }

  makeAccessor(name) {
    const _name = `_${name}`
    const defaultVal = this[name]

    let { get, set, el, dep } = defaultVal

    if (dep) {
      dep.forEach(depName => {
        this.depGetters[depName] = this.depGetters[depName] || []
        this.depGetters[depName].push(name)
      })
    }

    // Getter property
    if (get && dep) {
      Object.defineProperty(this, name, {
        get() { return this[_name] },
        set(val) {
          this[_name] = get.apply(this)
          if (set && val !== undefined) set.call(this, val)
          this.runSetter(name, this[name])
        }
      })

    // Element property
    } else if (el && dep) {
      Object.defineProperty(this, name, {
        get: el, set() { this.runElSetter(name) }
      })

    // Normal property
    } else {
      Object.defineProperty(this, name, {
        get() { return this[_name] },
        set(value) {
          this[_name] = value
          this.runSetter(name, value)
        }
      })
      this[name] = defaultVal
    }
  }

  runSetter(name, value) {
    this.cacheElements[name].forEach((element, i) => {
      const tname = `_${name}_html`
      if ('value' in element) {
        if (element !== document.activeElement) element.value = value
      } else if (this[tname] && this[tname][i]) {
        element.innerHTML = value
      } else {
        element.textContent = value
      }
    })
    this.setDepProp(name)
  }

  runElSetter(name) {
    const arr = this.cacheElements[name]
    this.cacheElements[name].forEach(elPair => {
      if (elPair.child) elPair.parent.removeChild(elPair.child)
      const child = this[name]
      elPair.child = child
      elPair.parent.appendChild(child)
    })
    this.setDepProp(name)
  }

  setDepProp(name) {
    if (this.depGetters[name]) {
      this.depGetters[name].forEach(depName => {
        this[depName] = undefined   // this[depName]
      })
    }
  }
}
el.setData = data => new Data(data)


let txt
const cache = {}
const prepareText = () => {
  if (txt) return
  txt = el.create('text', { x: 0, y: 50 }, '')
  const svg = el.create('svg', { width: 0, height: 0 }, [txt])
  document.body.appendChild(svg)
}
export const getSize = (font, content) => {
  const key = font + content
  if (cache[key]) return cache[key]
  prepareText()
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
