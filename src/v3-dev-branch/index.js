const Document = require('./types/Document')
const { color, equalObj } = require('./helpers')


// Quick-and-dirty test:

let testCounter = 0

const test = (Class, src, flag) => {
  const print = flag === 'mute' ? () => {} : console.log
  const instance = new Class(src)
  console.log(color('bright', `Test [${++testCounter}]:`))
  console.log(color('magenta', '- Source:'))
  console.log(src)

  print(color('magenta', '- To data (plain object):'))
  const jsonStr = JSON.stringify(instance, null, 2)
  print(jsonStr)

  print(color('magenta', '- To description:'))
  const serialized = '' + instance
  print(serialized)
  const assert1 = serialized === src
  print('Assert serialization:', assert1)

  print(color('magenta', '- From data (plain object)'))
  const instance2 = new Document(JSON.parse(jsonStr))
  print(instance2)
  const assert2 = JSON.stringify(instance2, null, 2) === jsonStr
  print('Assert data:', assert2)

  const result = assert1 && assert2

  console.log(result ? color('green', '(Pass)') : color('red', '(Fail)'))
  console.log()

  return result
}

console.log('# Test Document:')
test(Document, 'Abc {...}', 'mute')

test(Document,
`Def {
  AChildComponent {
    This is simple content.
  )]
}`)

console.log('Todo: children components')
console.log()
