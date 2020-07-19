// import { inspect } from 'util'
import Document from '../utils/XmlDocument'
import helloworld from '../../dist/scores/musicXml/helloworld.musicxml'
import reve from '../../dist/scores/musicXml/reve.musicxml'

// console.log(helloworld)
// console.log(reve)
// const fs = require('fs')
// fs.writeFileSync('reve1.js', reve.replace(/\n/g, '\r\n'), 'utf8')

const doc = new Document(helloworld)
// const doc = new Document(reve)
console.log(JSON.parse(JSON.stringify(doc)), '\n=== begin ===\n' + doc + '=== end ===')

/*
doc.root.actContent({
  'part-list': child => console.log(child),
  'part': child => console.log(child)
})
*/
/*
doc.root.content[0].content[0].actAttrs({
  id: attr => console.log(attr)
})
*/
