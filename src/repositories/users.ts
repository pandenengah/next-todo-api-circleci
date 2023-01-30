import { User } from "@/models/user";
import { Redis } from "ioredis";

const key = 'users'
const db = new Redis(process.env.REDIS_CONNECT_STR || '')

export const selectUsers = async (): Promise<User[]> => {
  const users = await getUsers()

  return users
}
export const insertUser = async (user: User): Promise<void> => {
  const users = await getUsers()

  users.push(user)

  db.set(key, JSON.stringify(users))
}
export const selectUserByEmail = async (email: string): Promise<User | null> => {
  const users = await getUsers()

  const filteredUser = users.filter((item) => {
    if (item.email === email) {
      return true
    }
    return false
  })

  if (filteredUser.length > 0) {
    return filteredUser[0]
  }

  return null
}
export const selectUserById = async (id: string): Promise<User | null> => {
  const users = await getUsers()

  const filteredUser = users.filter((item) => {
    if (item.id === id) {
      return true
    }
    return false
  })

  if (filteredUser.length > 0) {
    return filteredUser[0]
  }

  return null
}

const getUsers = async (): Promise<User[]> => {
  let res = await db.get(key)
  if (res) {
    return JSON.parse(res)
  }
  return []
}
