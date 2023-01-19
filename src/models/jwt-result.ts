import { JwtPayload } from "./jwt-payload"
import { User } from "./user"

export interface JwtResult<T> {
  isValid: boolean
  isExpired: boolean
  result: JwtPayload<T> | null
}
