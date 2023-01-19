import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<void>
) {
  switch (req.method) {
    case "GET":
      res.status(401).json()
      break;

    default:
      res.status(405).json()
      break;
  }
}
