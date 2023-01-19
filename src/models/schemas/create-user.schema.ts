import Joi from "joi";
import { CreateUserDto } from "../dtos/create-user.dto";


/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUserDto:
 *       required:
 *         - email
 *         - fullName
 *         - password
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         fullName:
 *           type: string
 *         password:
 *           minLenght: 6
 *           type: string
 */
export const createUserSchema = Joi.object<CreateUserDto>({
  email: Joi.string().email().required(),
  fullName: Joi.string().required(),
  password: Joi.string().min(6).required(),
})
