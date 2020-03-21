class Complex {
  constructor(re, im) {
    this.re = re
    this.im = im
  }

  add(b) { return Complex.add(this, b) }

  static add = (a, b) => {
    
  }
}

export default Complex
