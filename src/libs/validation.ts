import { NextApiRequest, NextApiResponse } from "next";
import { getTokenFromHeader, verifyToken } from "./jwt";
import { JwtResult } from "@/models/jwt-result";
import { User } from "@/models/user";


export const allowCors = (
  req: NextApiRequest,
  res: NextApiResponse,
  fn: Function
) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

export const checkAuthorization = (req: NextApiRequest): JwtResult<User> | null => {
  const token = getTokenFromHeader(req.headers.authorization || '')
  if (token) {
    const result = verifyToken(token)
    if (result.isValid) {
      return result
    }
  }
  return null
}
