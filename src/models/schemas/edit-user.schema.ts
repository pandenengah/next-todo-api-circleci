import Joi from "joi";
import { EditTodoDto } from "../dtos/edit-todo.dto";


/**
 * @swagger
 * components:
 *   schemas:
 *     EditTodoDto:
 *       required:
 *         - deadline
 *         - description
 *         - done
 *       type: object
 *       properties:
 *         deadline:
 *           type: string
 *           format: date-time
 *         description:
 *           type: string
 *           maxLength: 100
 *         done:
 *           type: boolean
 *         snapshootImage:
 *           type: string
 *           format: binary
 *           maxLength: 1024 * 10
 */
export const editUserSchema = Joi.object<EditTodoDto>({
  deadline: Joi.date().required(),
  description: Joi.string().max(100).required(),
  done: Joi.boolean().required(),
  snapshootImage: Joi.any(),
})
