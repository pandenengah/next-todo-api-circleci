import { Todo } from "@/models/todo";
import Redis from "ioredis";


const key = 'todos'
const db = new Redis(process.env.REDIS_CONNECT_STR || '')

export const selectTodos = async (sortType: 'asc' | 'desc' = 'asc'): Promise<Todo[]> => {
  const todos = await getTodos()

  if (sortType === "desc") {
    return todos.sort(sortDesc)
  }
  return todos.sort(sortAsc)
}
export const selectTodosByUserId = async (userId: string | null, sortType: 'asc' | 'desc' = 'asc'): Promise<Todo[]> => {
  const todos = await getTodos()

  const filtered = todos.filter((item) => item.userId == userId)
  if (sortType === "desc") {
    return filtered.sort(sortDesc)
  }
  return filtered.sort(sortAsc)
}
export const insertTodo = async (obj: Todo): Promise<void> => {
  const todos = await getTodos()

  todos.push(obj)

  db.set(key, JSON.stringify(todos))
}
export const selectTodoById = async (id: string): Promise<Todo | null> => {
  const todos = await getTodos()

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
  const todos = await getTodos()

  const index = todos.findIndex((item) => item.id === id)
  todos[index] = todo

  db.set(key, JSON.stringify(todos))
}

export const deleteTodo = async (id: string): Promise<void> => {
  const todos = await getTodos()

  const index = todos.findIndex((item) => item.id === id)
  todos.splice(index, 1)

  db.set(key, JSON.stringify(todos))
}

const getTodos = async (): Promise<Todo[]> => {
  let res = await db.get(key)
  if (res) {
    return JSON.parse(res)
  }
  return []
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
