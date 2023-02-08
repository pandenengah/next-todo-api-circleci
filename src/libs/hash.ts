import bcrypt from 'bcrypt'


export const doHash = async (plain: string): Promise<string> => {
  const salt = await bcrypt.genSalt(8);
  return await bcrypt.hash(plain, salt)
}

export const verifyHash = async (plain: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(plain, hash)
}
