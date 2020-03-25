import { el } from './utils/html'

export default function arrayElement() {
  let _id = 0
  const id = () => _id++
  const makeItem = () => ({ a: id(), rand: Math.random().toFixed(5) })

  const data = el.setData({
    todos: [
      makeItem(), makeItem(), makeItem()
    ],
    todosLength: { get() { return this.todos.length } },
    todosJson: { get() { return JSON.stringify(this.todos, null, 2) } },
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

    // Left panel
    el('div', { style: 'width: 37%; float: left'}, [
      el('button', { click: () => data.todos.push(makeItem()) }, 'push'),
      el('button', { click: () => data.todos.pop() }, 'pop'),
      el('button', { click: () => data.todos.shift() }, 'shift'),
      el('button', { click: () => data.todos.unshift(makeItem()) }, 'unshift'),
      el('button', {
        click: () => data.todos.splice(0, 2, makeItem(), makeItem())
      }, 'splice'),
      el('button', { click: () => data.todos.reverse() }, 'reverse'),
      el('span', [el('span', ' Items: '), el('span', data.$todosLength)]),
      el('ul', data.$todos.map(todo => {
        return el.create('li', [
          el('span', 'a: '), el('span', todo.a ),
          el('span', ', rand: '), el('span', todo.rand)
        ])
      })),
      el('ul', data.$todos.map(todo => {
        return el.create('li', [
          el('span', 'a: '), el('span', todo.a )
        ])
      })),
      el('div', el('span', 'test el')),
      el('div', el.create('span', 'test element'))
    ]),

    // Right panel
    el('div', { style: 'width: 37%; float: left; padding-left: 30px'}, [
      el('pre', data.$todosJson),
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
  ])
}
