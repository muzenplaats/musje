
export const el = (name, attrs, content) => {

  this.name = name
  this.attrs = {}
  this.content = []

  for (let att in attrs) {
    this.attrs[att] = attrs[att]
  }
  content.forEach(child => {
    if (typeof child === 'string') {
      this.content.push(child)
    } else {
      this.content.push(el)
    }
  })
}
