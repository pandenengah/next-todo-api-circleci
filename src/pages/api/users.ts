import { UserDto } from '@/models/dtos/user.dto'
import { selectUsers } from '@/repositories/users';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserDto[] | void>
) {
  switch (req.method) {
    /**
     * @swagger
     * /api/users:
     *   get:
     *     deprecated: false
     *     tags:
     *       - Users
     *     description: Show registered user
     *     responses:
     *       200:
     *         description: Success
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: "#/components/schemas/UserDto"
     */
    case "GET":
      const users = await selectUsers()
      const userDto: UserDto[] = users.map((item) => {
        return {
          id: item.id,
          email: item.email,
          fullName: item.fullName,
        }
      })
      res.status(200).json(userDto)
      break

    default:
      res.status(405).json()
      break;
  }
}
