
class UnitValue {
  constructor(value, unit) {
    this.value = value
    this.unit = unit
  }

  toString() { return this.value + this.unit }
}

const convFactors = [
  [1e-3, 'km'],
  [1, 'm', '', 'base'],
  [10, 'dm'],
  [100, 'cm'],
  [1e3, 'mm'],
  [1e6, 'um', '\\mu;m'],
  [1e9, 'nm']
]

class Converter{
  constructor(factors) {
    this.makeFactors(factors)
  }

  makeFactors(facs) {
    this.factors = {}
    facs.forEach(fac => {
      const unit = fac[1]
      this.factors[unit] = fac[0]
      if (fac[3] === 'base') this.baseUnit = fac[3]
    })
  }

  isUVal(a) { return a instanceof UnitValue }

  convert(uval, unit) {
    return new UnitValue(uval.value *
                this.factors[unit] / this.factors[uval.unit], unit)
  }

  add(a, b) {
    return new UnitValue(a.value + this.convert(b, a.unit).value, a.unit)
  }

  sub(a, b) {
    return new UnitValue(a.value - this.convert(b, a.unit).value, a.unit)
  }

  mul(a, b) {
    if (this.isUVal(a)) return new UnitValue(a.value * b, a.unit)
    return new UnitValue(a * b.value, b.unit)
  }

  div(a, b) {
    if (this.isUVal(a)) return new UnitValue(a.value / b, a.unit)
    return new UnitValue(a / b.value, b.unit + '-1')
  }
}

const length = new Converter(convFactors)
// length.convert('1.5m + 20cm in cm')
// length.convert('1.5m in cm')
const a = new UnitValue(1.5, 'm')
const b = new UnitValue(20, 'cm')
const ans = length.convert(a, 'cm')
const add = length.add(a, b)
const{log}=console;log(`${a} = ${ans}`)
log(`${a} + ${b} = ${add}`)
log(length.sub(a, b), length.mul(a, 2), length.mul(2, a), length.div(a, 2), length.div(2, a))
