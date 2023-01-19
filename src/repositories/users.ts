import { saveJsonFile } from "@/libs/file";
import { User } from "@/models/user";
import usersFromFile from "./storages/users.json"
import path from "path";


const usersPath = path.join(process.cwd(), 'src/repositories/storages/users.json')

export const selectUsers = async (): Promise<User[]> => {
  const users = usersFromFile as User[]

  return users
}
export const insertUser = async (user: User): Promise<void> => {
  const users = usersFromFile as User[]

  users.push(user)

  await saveJsonFile(usersPath, users)
}
export const selectUserByEmail = async (email: string): Promise<User | null> => {
  const users = usersFromFile as User[]

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
