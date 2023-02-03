import { res400ValidationError } from '@/libs/response';
import { allowCors } from '@/libs/validation';
import { UserDto } from '@/models/dtos/user.dto'
import { createUserSchema } from '@/models/schemas/create-user.schema';
import { User } from '@/models/user';
import { ValidationError } from '@/models/validation-error';
import { insertUser, selectUserByEmail } from '@/repositories/users';
import cors from 'cors';
import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserDto | ValidationError | void>
) {
  await allowCors(req, res, cors())

  switch (req.method) {
    /**
     * @swagger
     * /api/auth/register:
     *   post:
     *     tags:
     *       - Auth
     *     description: Register new user to the system
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             $ref: "#/components/schemas/CreateUserDto"
     *     responses:
     *       201:
     *         description: Created
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/UserDto"
     *       400:
     *         description: Bad Request
     */
    case "POST":
      const { error, value: validReq } = createUserSchema.validate(req.body);
      if (error) {
        res.status(400).json(res400ValidationError(error))
        return
      }

      // checkEmail
      const existingUser = await selectUserByEmail(validReq?.email || '')
      if (existingUser !== null) {
        const resError: ValidationError = {
          status: 400,
          title: 'Validation errors occurred',
          message: "\"email\" is already exist",
          errors: [{
            message: "\"email\" is already exist",
            path: ["email"],
            type: "string.email",
            context: {
              value: validReq?.email,
              invalids: [validReq?.email],
              label: "email",
              key: "email"
            }
          }]
        }
        res.status(400).json(resError)
        return
      }

      const newUser: User = {
        id: uuidv4(),
        email: validReq?.email || '',
        fullName: validReq?.fullName || '',
        password: validReq?.password || '',
      }
      await insertUser(newUser)

      res.status(201).json({
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName
      })
      break;

    default:
      res.status(405).json()
      break;
  }
}
