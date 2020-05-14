import Score from './model/Score'
import './appElement.css'

export const parse = musjeStr => new Score(musjeStr)

export const fromJSON = json => {
  if (typeof json === 'string') json = JSON.parse(json)
  return new Score(json)
}

window.musje = { parse, fromJSON }
