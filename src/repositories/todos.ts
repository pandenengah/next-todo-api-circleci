import { sleep } from "@/libs/sleep";
import { Todo } from "@/models/todo";


const todos: Todo[] = []

export const selectTodos = async (sortType: 'asc' | 'desc' = 'asc'): Promise<Todo[]> => {
  await sleep(99)
  if (sortType === "desc") {
    return todos.sort(sortDesc)
  }
  return todos.sort(sortAsc)
}
export const insertTodo = async (obj: Todo): Promise<void> => {
  await sleep(99)
  todos.push(obj)
}
export const selectTodoById = async (id: string): Promise<Todo | null> => {
  await sleep(99)
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
  await sleep(99)
  const index = todos.findIndex((item) => item.id === id)
  todos[index] = todo
}

export const deleteTodo = async (id: string): Promise<void> => {
  await sleep(99)
  const index = todos.findIndex((item) => item.id === id)
  todos.splice(index, 1)
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
