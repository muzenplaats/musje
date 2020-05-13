import Score from '../model/Score'

const score = new Score('123')

const sty1 = `
base {
  size: 50px
}
`
const sty2 = `
score {
  width: 450px
  margin-left: 20px
  margin-top: 20px
  margin-right: 20px
  margin-bottom: 20px
  head-body-sep: 120px
}
`
const sty3 = `
head {
  title-subtitle-sep: 70%
  title-creator-sep: 75%
  creators-sep: 60%
}
`

console.log('default')

let value = score.style.value
console.log(value.score.marginBottom)
console.log(value.score.headBodySep)
console.log(value.head.creatorsSep)

console.log('addStyle')

score.addStyle(sty2, sty3)
value = score.style.value
console.log(value.score.marginBottom)
console.log(value.score.headBodySep)
console.log(value.head.creatorsSep)

console.log('addStyle')

score.addStyle(sty1)
value = score.style.value
console.log(value.score.marginBottom)
console.log(value.score.headBodySep)
console.log(value.head.creatorsSep)
