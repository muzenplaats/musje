import { arrayToSet, unique, makeToJSON, repeat, flatten } from './helpers'

const { push, pop, shift, unshift, splice, reverse } = []

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

let _key = 0
const makeKey = () => '' + _key++
const setKey = (element, key) => { element.dataset.key = key; return element }
const getKey = element => {
  let key
  while (element) {
    key = element.dataset.key
    if (key) return key
    element = element.parentNode
  }
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
  return { data, defaultData }
}

class Data {
  constructor(data) {
    this.defaultData = configDeps(data).defaultData
    Object.assign(this, data)
    this.cacheElements = {}
    this.depGetters = {}
    this.makeConnectors()
  }

  set(name, func) {
    func(this[name])
    this[name] = this[name]
  }

  makeConnectors() {
    Object.keys(this).forEach(name => {
      if (name === 'cacheElements' || name === 'depGetters' || name === 'defaultData') return
      if (this.hasOwnProperty(name)) {
        this.cacheElements[name] = []
        this[`$${name}`] = this.makeConnector(name)
        this.makeAccessor(name)
      }
    })
  }

  makeConnector(name) {
    const { get } = this[name]
    if (Array.isArray(this.defaultData[name])) {
      return this.makeArrayConnector(name)
    }
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

  makeArrayConnector(name) {
    const that = this
    const funct = parent => {
      that.cacheElements[name].push({
        parent, children: [], map: funct._map.shift()
      })
      that[name] = that[name]
    }
    funct._map = []
    funct.map = map => { funct._map.push(map); return funct }
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
      if (Array.isArray(this.defaultData[name])) {
        this.makeGetArrayAccessor(name, _name, get, set)
      } else {
        Object.defineProperty(this, name, {
          get() { return this[_name] },
          set(val) {
            this[_name] = get.apply(this)
            if (set && val !== undefined) set.call(this, val)
            this.runSetter(name, this[name])
          }
        })
      }

    // Element property
    } else if (el && dep) {
      Object.defineProperty(this, name, {
        get: el, set() { this.runElSetter(name) }
      })

    // Normal property
    } else {
      if (Array.isArray(defaultVal)) {
        this.makeArrayAccessor(name, _name)
      } else {
        Object.defineProperty(this, name, {
          get() { return this[_name] },
          set(value) {
            this[_name] = value
            this.runSetter(name, value)
          }
        })
      }
      this[name] = defaultVal
    }
  }

  alterArrayMethods(name, arr) {
    const cache = this.cacheElements[name]
    const getChildren = () => this.cacheElements[name]
    const that = this
    Object.assign(arr, {
      push() {
        const args = Array.from(arguments)
        args.forEach(arg => {
          const key = makeKey()
          this.keys.push(key)
          cache.forEach(elPair => {
            const cel = setKey(elPair.map(arg))
            elPair.children.push(cel)
            elPair.parent.appendChild(cel)
          })
        })
        const result = push.apply(this, args)
        that.setDepProp(name)
        return result
      },
      pop() {
        cache.forEach(elPair => {
          const last = elPair.children.pop()
          if (last) elPair.parent.removeChild(last)
        })
        this.keys.pop()
        const result = pop.apply(this)
        that.setDepProp(name)
        return result
      },
      shift() {
        cache.forEach(elPair => {
          const first = elPair.children.shift()
          if (first) elPair.parent.removeChild(first)
        })
        this.keys.shift()
        const result = shift.apply(this)
        that.setDepProp(name)
        return result
      },
      unshift() {
        const args = Array.from(arguments)
        args.slice().reverse().forEach(arg => {
          const key = makeKey()
          this.keys.unshift(key)
          cache.forEach(elPair => {
            const cel = setKey(elPair.map(arg), key)
            elPair.children.unshift(cel)
            elPair.parent.prepend(cel)
          })
        })
        const result = unshift.apply(this, args)
        that.setDepProp(name)
        return result
      },
      splice() {
        const args = Array.from(arguments)
        const result = splice.apply(this, args)
        that.runArraySetter(name, this)
        return result
      },
      reverse() {
        cache.forEach(elPair => {
          elPair.parent.textContent = ''
          elPair.children.reverse()
          elPair.children.forEach(element => {
            elPair.parent.appendChild(element)
          })
        })
        this.keys.reverse()
        const result = reverse.apply(this)
        that.setDepProp(name)
        return result
      },
      indexOfEl(element) {
        const key = getKey(element)
        return this.keys.indexOf(key)
      },
      itemOfEl(element) {
        const index = this.indexOfEl(element)
        return this[index]
      },
      removeAt(index) {
        if (index > -1) return this.splice(index, 1)
      },
      remove(item) {
        const index = this.findIndex(itm => itm === item)
        return this.removeAt(index)
      }
    })
    return arr
  }

  makeArrayAccessor(name, _name) {
    Object.defineProperty(this, name, {
      get() { return this[_name] },
      set(value) {
        this[_name] = this.alterArrayMethods(name, value)
        this.runArraySetter(name, value)
      }
    })
  }

  makeGetArrayAccessor(name, _name, get, set) {
    Object.defineProperty(this, name, {
      get() { return this[_name] },
      set(value) {
        value = this[_name] = get.apply(this) || []
        if (set && value !== undefined) set.call(this, value)
        this[_name] = this.alterArrayMethods(name, value)
        this.runArraySetter(name, value)
      }
    })
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

  runArraySetter(name, value) {
    this.cacheElements[name].forEach(elPair => {
      elPair.parent.textContent = ''
      elPair.children.length = 0
      value.keys = []
      elPair.children = value.map((item, i) => {
        const key = makeKey()
        const child = setKey(elPair.map(item, i), key)
        elPair.parent.appendChild(child)
        value.keys.push(key)
        return child
      })
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
