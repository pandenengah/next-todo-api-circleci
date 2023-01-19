import { NextApiRequest } from "next";
import { getTokenFromHeader, verifyToken } from "./jwt";
import { JwtResult } from "@/models/jwt-result";
import { User } from "@/models/user";


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
