import { User } from "./user"

export interface Todo {
  id: string
  description: string
  deadline: string
  done: boolean
  snapshootImage: string
  userId: string | null
  secretField?: string
}
