import { generateToken } from '@/libs/jwt';
import { res400ValidationError } from '@/libs/response';
import { LoginDto } from '@/models/dtos/login.dto';
import { loginUserSchema } from '@/models/schemas/login-user.schema';
import { ValidationError } from '@/models/validation-error';
import { selectUserByEmail } from '@/repositories/users';
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginDto | ValidationError | void>
) {
  switch (req.method) {
    /**
     * @swagger
     * /api/auth/login:
     *   post:
     *     tags:
     *       - Auth
     *     description: Login to get to get token
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             $ref: "#/components/schemas/LoginUserDto"
     *     responses:
     *       200:
     *         description: Success
     *         content:
     *           application/json:
     *             schema:
     *               $ref: "#/components/schemas/LoginDto"
     *       400:
     *         description: Bad Request
     */
    case "POST":
      const { error, value: validReq } = loginUserSchema.validate(req.body);
      if (error) {
        res.status(400).json(res400ValidationError(error))
        return
      }

      // checkEmail
      const existingUser = await selectUserByEmail(validReq?.email || '')
      if (existingUser === null) {
        const resError: ValidationError = {
          status: 400,
          title: 'Validation errors occurred',
          message: "\"email\" is not exist",
          errors: [{
            message: "\"email\" is not exist",
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

      const cleanUser = {
        id: existingUser.id,
        email: existingUser.email,
        fullName: existingUser.fullName,
      }

      res.status(200).json({
        ...cleanUser,
        accessToken: generateToken(cleanUser)
      })
      break;

    default:
      res.status(405).json()
      break;
  }
}
