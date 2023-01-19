export interface JwtPayload<T> {
  data: T
  iat: number
  exp: number
}
