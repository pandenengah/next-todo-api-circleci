// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { allowCors } from '@/libs/validation'
import cors from 'cors'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

/**
 * @swagger
 * /api/hello:
 *   get:
 *     deprecated: true
 *     tags:
 *       - Hello
 *     description: Returns the hello world
 *     responses:
 *       200:
 *         description: hello world
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await allowCors(req, res, cors())

  res.status(200).json({ name: 'John Doe' })
}
