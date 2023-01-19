import { sleep } from "@/libs/sleep";
import { Todo } from "@/models/todo";
import todoFromFile from "./storages/todos.json"
import { saveJsonFile } from "@/libs/file";


const todosPath = './src/repositories/storages/todos.json'

export const selectTodos = async (sortType: 'asc' | 'desc' = 'asc'): Promise<Todo[]> => {
  const todos = todoFromFile as Todo[]

  if (sortType === "desc") {
    return todos.sort(sortDesc)
  }
  return todos.sort(sortAsc)
}
export const insertTodo = async (obj: Todo): Promise<void> => {
  const todos = todoFromFile as Todo[]

  todos.push(obj)

  // await saveJsonFile(todosPath, todos)
}
export const selectTodoById = async (id: string): Promise<Todo | null> => {
  const todos = todoFromFile as Todo[]

  const filtered = todos.filter((item) => {
    if (item.id === id) {
      return true
    }
    return false
  })

  if (filtered.length > 0) {
    return filtered[0]
  }

  return null
}

export const alterTodo = async (id: string, todo: Todo): Promise<void> => {
  const todos = todoFromFile as Todo[]

  const index = todos.findIndex((item) => item.id === id)
  todos[index] = todo

  // await saveJsonFile(todosPath, todos)
}

export const deleteTodo = async (id: string): Promise<void> => {
  const todos = todoFromFile as Todo[]

  const index = todos.findIndex((item) => item.id === id)
  todos.splice(index, 1)

  // await saveJsonFile(todosPath, todos)
}

const sortAsc = (a: any, b: any) => {
  if (a.deadline < b.deadline) {
    return -1
  }
  if (a.deadline > b.deadline) {
    return 1
  }
  return 0
}
const sortDesc = (a: any, b: any) => {
  if (a.deadline < b.deadline) {
    return 1
  }
  if (a.deadline > b.deadline) {
    return -1
  }
  return 0
}
