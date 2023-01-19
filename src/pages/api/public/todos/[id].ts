import { res400ValidationError } from '@/libs/response'
import { TodoDto } from '@/models/dtos/todo.dto'
import { ValidationError } from '@/models/validation-error'
import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from "formidable";
import { deleteTodoFile, getTodoFilePathWithName, saveTodoFile } from '@/libs/file'
import { Todo } from '@/models/todo'
import { v4 as uuidv4 } from 'uuid';
import { editUserSchema } from '@/models/schemas/edit-user.schema'
import { alterTodo, deleteTodo, selectTodoById } from '@/repositories/todos';


// disable nextjs body parsing because of using multipart/formdata
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ValidationError | void | TodoDto>
) {
  switch (req.method) {
    case "GET":
      await get(req, res)
      break
    case "PUT":
      await put(req, res)
      break
    case "DELETE":
      await del(req, res)
      break
    default:
      res.status(405).json()
      break
  }
}

/**
 * @swagger
 * /api/public/todos/{id}:
 *   get:
 *     tags:
 *       - Todos Public
 *     description: Get spesific todo
 *     parameters:
 *       - :
 *         name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/TodoDto"
 *       404:
 *         description: Not Found
 */
const get = async (
  req: NextApiRequest,
  res: NextApiResponse<ValidationError | void | TodoDto>
) => {
  const { id } = req.query

  const todo = await selectTodoById(id + '')

  if (!todo) {
    res.status(404).json()
    return
  }

  const todoDto: TodoDto = {
    id: todo.id,
    deadline: todo.deadline,
    description: todo.description,
    done: todo.done,
    snapshootImage: todo.snapshootImage,
  }
  res.status(200).json(todoDto)
}

/**
 * @swagger
 * /api/public/todos/{id}:
 *   put:
 *     tags:
 *       - Todos Public
 *     description: Edit existing todo
 *     parameters:
 *       - :
 *         name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: "#/components/schemas/EditTodoDto"
 *     responses:
 *       204:
 *         description: No Content
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Not Found
 */
const put = async (
  req: NextApiRequest,
  res: NextApiResponse<ValidationError | void>
) => {
  const { id } = req.query

  const todo = await selectTodoById(id + '')

  if (!todo) {
    res.status(404).json()
    return
  }

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, field, files) => {
    const reqData = {
      ...field,
      snapshootImage: files.snapshootImage
    }
    const { error, value: validReq } = editUserSchema.validate(reqData)
    if (error) {
      res.status(400).json(res400ValidationError(error))
      return
    }

    let snapshootImageName = todo.snapshootImage

    if (validReq.snapshootImage instanceof formidable.File) {
      // check image type
      if (!validReq.snapshootImage?.mimetype?.includes('image')) {
        const resError: ValidationError = {
          status: 400,
          title: 'Validation errors occurred',
          message: "\"snapshootImage\" must be an image",
          errors: [{
            message: "\"snapshootImage\" must be an image",
            path: ["snapshootImage"],
            type: "binary",
            context: {
              value: validReq.snapshootImage?.mimetype,
              limit: 'image/*',
              label: "snapshootImage",
              key: "snapshootImage"
            }
          }]
        }
        res.status(400).json(resError)
        return
      }

      // check image size
      if (validReq.snapshootImage?.size > (1024 * 10)) {
        const resError: ValidationError = {
          status: 400,
          title: 'Validation errors occurred',
          message: "\"snapshootImage\" size has to be less than 10KB",
          errors: [{
            message: "\"snapshootImage\" size has to be less than 10KB",
            path: ["snapshootImage"],
            type: "binary",
            context: {
              value: validReq.snapshootImage?.size,
              limit: 1024 * 10,
              label: "snapshootImage",
              key: "snapshootImage"
            }
          }]
        }
        res.status(400).json(resError)
        return
      }

      // delete old image
      await deleteTodoFile(todo.snapshootImage)

      // store image
      await saveTodoFile(validReq.snapshootImage);

      snapshootImageName = getTodoFilePathWithName(validReq.snapshootImage)
    }


    const newTodo: Todo = {
      id: id + '',
      deadline: validReq.deadline,
      done: validReq.done,
      description: validReq.description,
      snapshootImage: snapshootImageName,
    }
    await alterTodo(id + '', newTodo)

    res.status(204).json()
  })
}
/**
 * @swagger
 * /api/public/todos/{id}:
 *   delete:
 *     tags:
 *       - Todos Public
 *     description: Delete existing todo
 *     parameters:
 *       - :
 *         name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: No Content
 *       404:
 *         description: Not Found
 */
const del = async (
  req: NextApiRequest,
  res: NextApiResponse<ValidationError | void>
) => {
  const { id } = req.query

  const todo = await selectTodoById(id + '')

  if (!todo) {
    res.status(404).json()
    return
  }

  await deleteTodoFile(todo.snapshootImage)

  await deleteTodo(id + '')

  res.status(204).json()
}
