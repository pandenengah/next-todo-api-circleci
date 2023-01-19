import { NextApiRequest } from "next"


export const getBaseUrl = (req: NextApiRequest) => {
  const protocol = req.headers['x-forwarded-proto'] || 'http'
  return req ? `${protocol}://${req.headers.host}` : ''
}
