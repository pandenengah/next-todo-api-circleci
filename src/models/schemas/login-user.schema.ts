import Joi from "joi";
import { LoginUserDto } from "../dtos/login-user.dto";


/**
 * @swagger
 * components:
 *   schemas:
 *     LoginUserDto:
 *       required:
 *         - email
 *         - password
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           minLenght: 6
 *           type: string
 */
export const loginUserSchema = Joi.object<LoginUserDto>({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
})
