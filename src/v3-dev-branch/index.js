const Document = require('./types/Document')
const { color, equalObj } = require('./helpers')


// Quick-and-dirty test:

const test = (Class, src) => {
  const instance = new Class(src)
  console.log(color('magenta', '- Source:'))
  console.log(src)

  console.log(color('magenta', '- To Data:'))
  const jsonStr = JSON.stringify(instance, null, 2)
  console.log(jsonStr)

  console.log(color('magenta', '- To Description:'))
  const serialized = '' + instance
  console.log(serialized)
  const assert1 = serialized === src
  console.log('Assert serialization:', assert1)

  console.log(color('magenta', '- Instance from data(plain object)'))
  const instance2 = new Document(JSON.parse(jsonStr))
  console.log(instance2)
  const assert2 = JSON.stringify(instance2, null, 2) === jsonStr
  console.log('Assert data:', assert2)

  const result = assert1 && assert2

  console.log(result ? color('green', '(Pass)') : color('red', '(Fail)'))
  console.log()

  return result
}

console.log('# Test Document:')
test(Document, 'Abc {...}')

test(Document, `
Def {
  AChildComponent {
    This is simple content.
  )]
}
`)
