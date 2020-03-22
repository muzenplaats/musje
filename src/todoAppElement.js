import { el } from './utils/html'

export default function todoAppElement() {
  const data = el.setData({
    todos: [
      { a: 1 },
      { a: 2 },
      { a: 3 }
    ]
  })

  setTimeout(() => {
    data.todos = [
      { a: 11 },
      { a: 22 },
      { a: 33 }
    ]
  }, 3000)

  let _id = 0
  const id = () => _id++

  return el.create('div', [
    el('h1', 'Todo App'),
    el('ul', data.$todos.map(todo => {
      return el.create('li', [
        el('span', 'a: '), el('span', todo.a )
      ])
    })),
    el('button', { click: () => data.todos.push({ a: id() }) }, 'push'),
    el('button', { click: () => data.todos.pop() }, 'pop')
  ])
}
