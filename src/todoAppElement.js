import { el } from './utils/html'
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
        return el.create('li', [
          el('input', {
            type: 'checkbox',
            click: event => {
              const element = event.target
              if (element.value === 'on') {
                const index = data.incompletedTasks.indexOfEl(element)
                data.incompletedTasks[0].isCompleted = true
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
        return el.create('li', [
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



//=====================================================================

  // const main = el.create('section', [
  //   el('h1', 'To-Do App'),
  //   el('div', { class: 'new-task-container box' }, [
  //     el('label', { for: 'new-task' }, 'Add New Task '),
  //     el('input', { type: 'text', id: 'new-task' }),
  //     el('button', { click: addTask }, 'Add Task')
  //   ]),
  //   el('div', { class: 'todo-list box' }, [
  //     el('h2', 'Incomplete Tasks'),
  //     el('ul', [
  //       el('li', [
  //         el('input', { type: 'checkbox' }), el('label', 'Task Name')
  //       ]),
  //       el('li', [
  //         el('input', { type: 'checkbox' }), el('label', 'Task Name')
  //       ]),
  //       el('li', [
  //         el('input', { type: 'checkbox' }), el('label', 'Task Name')
  //       ])
  //     ])
  //   ]),
  //   el('div', { class: 'complete-list box' }, [
  //     el('h2', 'Completed Tasks'),
  //     el('ul', [
  //       el('li', [
  //         el('span', 'Task Name '),
  //         el('button', { class: 'delete' }, 'Delete')
  //       ])
  //     ])
  //   ])
  // ])

  // const newTask = main.querySelector('#new-task')
  // const toDoUl = main.querySelector(".todo-list ul")
  // const completeUl =  main.querySelector(".complete-list ul")

  // function addTask() {
  //   const listItem = el.create('li', [
  //     el('input', { type: 'checkbox' }),
  //     el('label', newTask.value)
  //   ])
  //   toDoUl.appendChild(listItem)
  //   newTask.value = ''
  //   bindIncompleteItems(listItem, completeTask)
  // }

  // const completeTask = function () {
  //   const listItem = this.parentNode
  //   const deleteBtn = el.create('button', { class: 'delete' }, 'Delete')
  //   listItem.appendChild(deleteBtn)
  //   const checkBox = listItem.querySelector('input[type=checkbox]')
  //   checkBox.remove()
  //   completeUl.appendChild(listItem)
  //   bindCompleteItems(listItem, deleteTask)
  // }

  // const deleteTask = function () {
  //   const listItem = this.parentNode
  //   const ul = listItem.parentNode
  //   ul.removeChild(listItem)
  // }

  // const bindIncompleteItems = function (taskItem, checkBoxClick) {
  //   const checkBox = taskItem.querySelector('input[type=checkbox]')
  //   checkBox.onchange = checkBoxClick
  // }

  // const bindCompleteItems = function (taskItem, deleteButtonPress) {
  //   const deleteButton = taskItem.querySelector('.delete')
  //   deleteButton.onclick = deleteButtonPress
  // }

  // for(let i = 0; i < toDoUl.children.length; i++) {
  //   bindIncompleteItems(toDoUl.children[i], completeTask)
  // }

  // for(let i = 0; i < completeUl.children.length; i++) {
  //   bindCompleteItems(completeUl.children[i], deleteTask)
  // }

  // return main
}
