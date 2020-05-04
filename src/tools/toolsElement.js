import el from '../utils/el'
import convertPathD from './convertPathD'

export default function toolsElement() {
  return el.create('div', { style: 'width: 90%; margin: 15px' }, [
    el('h1', { style: 'font-size: 26px' }, 'Tools'),

    el('pre', {
      style: 'border: 1px solid #ccc; padding: 5px; width: 100%; background-color: #eee; white-space: pre-wrap'
    }, convertPathD()),
  ])
}
