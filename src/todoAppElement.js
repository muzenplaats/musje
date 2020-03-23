import { el } from './utils/html'

export default function todoAppElement() {
  let _id = 0
  const id = () => _id++
  const makeItem = () => ({ a: id(), rand: Math.random().toFixed(5) })

  const data = el.setData({
    todos: [
      makeItem(), makeItem(), makeItem()
    ],
    todosLength: { get() { return this.todos.length } },
    filteredTodos: {
      get() {
        return this.todos.filter(item => item.rand > 0.5)
      }
    },
    filteredTodosLength: { get() {
      return this.filteredTodos.length
    }}
  })

  setTimeout(() => {
    data.todos = [
      makeItem()
    ]
  }, 3000)

  return el.create('div', [
    el('h1', 'Todo App'),
    el('button', { click: () => data.todos.push(makeItem()) }, 'push'),
    el('button', { click: () => data.todos.pop() }, 'pop'),
    el('button', { click: () => data.todos.shift() }, 'shift'),
    el('button', { click: () => data.todos.unshift(makeItem()) }, 'unshift'),
    el('span', [el('span', ' Items: '), el('span', data.$todosLength)]),
    el('ul', data.$todos.map(todo => {
      return el.create('li', [
        el('span', 'a: '), el('span', todo.a ),
        el('span', ', rand: '), el('span', todo.rand)
      ])
    })),
    el('span', [
      el('span', ' Filtered items: '),
      el('span', data.$filteredTodosLength)
    ]),
    el('ul', data.$filteredTodos.map(todo => {
      return el.create('li', [
        el('span', 'a: '), el('span', todo.a ),
        el('span', ', rand: '), el('span', todo.rand)
      ])
    }))
  ])
}
