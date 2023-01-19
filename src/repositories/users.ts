import { readJsonFile, saveJsonFile } from "@/libs/file";
import { User } from "@/models/user";
// import usersFromFile from "../../tmp/storages/users.json"


const usersPath = '/tmp/storages'
const usersName = 'users.json'

export const selectUsers = async (): Promise<User[]> => {
  const users = await readJsonFile<User[]>(usersPath)

  return users
}
export const insertUser = async (user: User): Promise<void> => {
  const users = await readJsonFile<User[]>(usersPath)

  users.push(user)

  await saveJsonFile(usersPath, usersName, users)
}
export const selectUserByEmail = async (email: string): Promise<User | null> => {
  const users = await readJsonFile<User[]>(usersPath)

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
