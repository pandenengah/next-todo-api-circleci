import { JwtPayload } from "@/models/jwt-payload";
import { JwtResult } from "@/models/jwt-result";
import { User } from "@/models/user"
import { sign, verify } from "jsonwebtoken"

export const generateToken = (user: User): string => {
  return sign({ data: user }, process.env.JWT_SECRET_KEY || '', { expiresIn: '1d' });
}


export const verifyToken = (token: string): JwtResult<User> => {
  try {
    const result = verify(token, process.env.JWT_SECRET_KEY || '') as JwtPayload<User>
    if (result?.data) {
      return {
        isValid: true,
        isExpired: false,
        result,
      }
    }
    return {
      isValid: false,
      isExpired: false,
      result: null,
    }
  }
  catch(err: any) {
    if (err+''.includes('jwt expired')) {
      return {
        isValid: false,
        isExpired: true,
        result: null,
      }
    }
    return {
      isValid: false,
      isExpired: false,
      result: null,
    }
  }
}

export const getTokenFromHeader = (value: string): string | null => {
  if (value.toLowerCase().includes('bearer')) {
    const splitted = value.split(' ')
    return splitted[1]
  }
  return null
}
