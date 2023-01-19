import { sleep } from "@/libs/sleep";
import { User } from "@/models/user";


const users: User[] = []

export const selectUsers = async (): Promise<User[]> => {
  await sleep(99)
  return users
}
export const insertUser = async (user: User): Promise<void> => {
  await sleep(99)
  users.push(user)
}
export const selectUserByEmail = async (email: string): Promise<User | null> => {
  await sleep(99)
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
