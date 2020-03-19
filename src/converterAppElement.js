import { el } from './utils/html'

export default function converterAppElement() {
  return el.create('div', [
    el('h2', 'Text input fields'),
    el('form', [
      el('label', { for: 'fname' }, 'First name: '),
      // el('br'),
      el('input', {
        type: 'text', id: 'fname', name: 'fname', value: 'John'
      }),
      el('br'),
      el('label', { for: 'lname' }, 'Last name: '),
      // el('br'),
      el('input', {
        type: 'text', id: 'lname', name: 'lname', value: 'Doe'
      }),
      el('p', 'Note that the form itself is not visible.'),
      el('p', 'Also note that the default width of text input fields is 20 characters.')
    ]),
    el.html('div', 'test&nbsp;test<br>test')
  ])
}

