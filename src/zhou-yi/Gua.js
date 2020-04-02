import zhouYi from './zhou-yi.json'
const { guas, baGuas } = zhouYi

// 六十四卦
export default class Gua {
  constructor(selector) {
    switch (typeof selector) {
      case 'string':
        if (isNaN(selector)) {
          Object.assign(this, Gua.getByName(selector))
        } else {
          Object.assign(this, Gua.getByCode(selector))
        }
        break
      case 'number': Object.assign(this, Gua.getByCodeNumber(selector)); break
      case 'object': Object.assign(this, selector); break
      default: throw new Error(`Invalid selector: ${selector}`)
    }
  }

  // 上卦 外卦
  get topGua() { return new BaGua(this.code.substr(3)) }
  get outerGua() { return this.topGua() }

  // 下卦 內卦
  get bottomGua() { return new BaGua(this.code.substr(0, 3)) }
  get innerGua() { return this.bottomGua() }

  // 交卦
  get crossGua() { return new BaGua(this.code.substr(1, 3)) }

  // 互卦
  get mutualGua() { return new BaGua(this.code.substr(2, 3)) }

  // 錯卦
  get cuoGua() { return Gua.getByCodeNumber(63 - this.codeNumber) }

  // 綜卦
  get zongGua() {
    return Gua.getByCode(this.code.split('').reverse().join(''))
  }

  // 之卦
  zhiGua(...positions) {
    const changeCode = (code, positions) => {
      positions.forEach(position => {
        const pos = position - 1
        code = code.slice(0, pos) + (code[pos] === '0' ? '1' : '0') + code.slice(position)
      })
      return code
    }
    return new Gua(changeCode(this.code, positions))
  }

  // 交互卦
  get alterGua() {
    const c = this.crossGua
    const m = this.mutualGua
    return new Gua(c.code + m.code)
  }

  static getByName(name) { 
    return new Gua(guas.find(item => item.name === name)) 
  }
  static getBySerial(serial) { 
    return new Gua(guas.find(item => item.serial === serial))
  }
  static getByCode(code) {
    return new Gua(guas.find(item => item.code === code)) 
  }
  static getByCodeNumber(codeNumber) { 
    return new Gua(guas.find(item => item.codeNumber === codeNumber))
  }
}

// 八卦
class BaGua {
  constructor(selector) {
    switch (typeof selector) {
      case 'string':
        if (isNaN(selector)) {
          Object.assign(this, BaGua.getByName(selector))
        } else {
          Object.assign(this, BaGua.getByCode(selector))
        }
        break
      case 'number': 
        Object.assign(this, BaGua.getByCodeNumber(selector)); break
      case 'object': Object.assign(this, selector); break
      default: throw new Error(`Invalid selector: ${selector}`)
    }
  }
  static getByName(name) { 
    return new BaGua(baGuas.find(item => item.name === name))
  }
  static getByCode(code) { 
    return new BaGua(baGuas.find(item => item.code === code)) 
  }
  static getByCodeNumber(codeNumber) { 
    return new BaGua(baGuas.find(item => item.codeNumber === codeNumber))
  }
}
