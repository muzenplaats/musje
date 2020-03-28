import el from './utils/el'
import './todoAppElement.css'

// Ref: https://codepen.io/barkins/pen/aEriL
export default function todoAppElement() {

  const data = el.setData({
    tasks: [
      { name: 'Task Name 1', isCompleted: false },
      { name: 'Task Name 2', isCompleted: false },
      { name: 'Task Name 3', isCompleted: false },
      { name: 'Task Name 4', isCompleted: true }
    ],
    completedTasks: {
      get() { return this.tasks.filter(task => task.isCompleted) }
    },
    incompletedTasks: {
      get() { return this.tasks.filter(task => !task.isCompleted) }
    },
    newTaskName: ''
  })

  return el.create('section', [
    el('h1', 'To-Do App'),

    el('div', { class: 'new-task-container box' }, [
      el('label', { for: 'new-task' }, 'Add New Task '),
      el('input', { type: 'text', value: data.$newTaskName }),
      el('button', {
        click: () => {
          data.tasks.push({ name: data.newTaskName, })
          data.newTaskName = ''
        }
      }, 'Add Task')
    ]),

    el('div', { class: 'todo-list box' }, [
      el('h2', 'Incomplete Tasks'),
      el('ul', data.$incompletedTasks.map(task => {
        return el('li', [
          el('input', {
            type: 'checkbox',
            click: event => {
              const element = event.target
              if (element.value === 'on') {
                const index = data.incompletedTasks.indexOfEl(element)
                data.incompletedTasks[index].isCompleted = true
                data.tasks = data.tasks
              }
            }
          }),
          el('label', task.name)
        ])
      }))
    ]),

    el('div', { class: 'complete-list box' }, [
      el('h2', 'Completed Tasks'),
      el('ul', data.$completedTasks.map(task => {
        return el('li', [
          el('span', task.name),
          el('button', {
            class: 'delete',
            click: event => {
              const element = event.target
              const item = data.completedTasks.itemOfEl(element)
              data.tasks.remove(item)
            }
          }, 'Delete')
        ])
      }))
    ])
  ])
}
