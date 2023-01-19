import Joi from "joi";
import { CreateTodoDto } from "../dtos/create-todo.dto";


/**
 * @swagger
 * components:
 *   schemas:
 *     CreateTodoDto:
 *       required:
 *         - deadline
 *         - description
 *       type: object
 *       properties:
 *         deadline:
 *           type: string
 *           format: date-time
 *         description:
 *           type: string
 *           maxLength: 100
 *         snapshootImage:
 *           type: string
 *           format: binary
 *           maxLength: 1024 * 10
 */
export const createTodoSchema = Joi.object<CreateTodoDto>({
  deadline: Joi.date().min('now').required(),
  description: Joi.string().max(100).required(),
  snapshootImage: Joi.any(),
})
