import { res400ValidationError } from '@/libs/response'
import { TodoDto } from '@/models/dtos/todo.dto'
import { createTodoSchema } from '@/models/schemas/create-todo.schema'
import { getTodoSchema } from '@/models/schemas/get-todo.schema'
import { ValidationError } from '@/models/validation-error'
import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from "formidable";
import { getTodoFilePathWithName, saveTodoFile } from '@/libs/file'
import { Todo } from '@/models/todo'
import { v4 as uuidv4 } from 'uuid';
import { insertTodo, selectTodos, selectTodosByUserId } from '@/repositories/todos'
import { allowCors, checkAuthorization } from '@/libs/validation'
import cors from 'cors'
import { selectUserById } from '@/repositories/users'
import { UserDto } from '@/models/dtos/user.dto'


// disable nextjs body parsing because of using multipart/formdata
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ValidationError | void | TodoDto[] | TodoDto>
) {
  await allowCors(req, res, cors())

  switch (req.method) {
    case "GET":
      await get(req, res)
      break
    case "POST":
      await post(req, res)
      break
    default:
      res.status(405).json()
      break
  }
}

/**
 * @swagger
 * /api/todos:
 *   get:
 *     tags:
 *       - Todos
 *     description: Get list of all todos
 *     parameters:
 *       - :
 *         name: sortType
 *         in: query
 *         schema:
 *           $ref: "#/components/schemas/SortType"
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/TodoDto"
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *     security:
 *       - oauth2: []
 */
const get = async (
  req: NextApiRequest,
  res: NextApiResponse<ValidationError | void | TodoDto[]>
) => {
  const auth = checkAuthorization(req)
  if (!auth) {
    res.status(401).json()
    return
  }

  const { error, value: validReq } = getTodoSchema.validate(req.query)
  if (error) {
    res.status(400).json(res400ValidationError(error))
    return
  }

  const todos = await selectTodosByUserId(auth.result?.data?.id || null, validReq.sortType)
  const user = await selectUserById(auth.result?.data?.id || '')
  const userDto: UserDto = {
    id: user?.id || '',
    email: user?.email || '',
    fullName: user?.fullName || ''
  }
  const todosDto: TodoDto[] = todos.map((item) => {
    return {
      id: item.id,
      deadline: item.deadline,
      description: item.description,
      done: item.done,
      snapshootImage: item.snapshootImage,
      userId: item.userId,
      user: userDto,
    } as TodoDto
  })
  res.status(200).json(todosDto)
}

/**
 * @swagger
 * /api/todos:
 *   post:
 *     tags:
 *       - Todos
 *     description: Create new todo
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: "#/components/schemas/CreateTodoDto"
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/TodoDto"
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 *     security:
 *       - oauth2: []
 */
const post = async (
  req: NextApiRequest,
  res: NextApiResponse<ValidationError | void | TodoDto>
) => {
  const auth = checkAuthorization(req)
  if (!auth) {
    res.status(401).json()
    return
  }

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, field, files) => {
    const reqData = {
      ...field,
      snapshootImage: files.snapshootImage
    }
    const { error, value: validReq } = createTodoSchema.validate(reqData)
    if (error) {
      res.status(400).json(res400ValidationError(error))
      return
    }

    let snapshootImageName = ''

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

      // store image
      await saveTodoFile(validReq.snapshootImage);

      snapshootImageName = getTodoFilePathWithName(validReq.snapshootImage)
    }

    const newTodo: Todo = {
      id: uuidv4(),
      deadline: validReq.deadline,
      done: false,
      description: validReq.description,
      snapshootImage: snapshootImageName,
      userId: auth.result?.data?.id || null
    }
    await insertTodo(newTodo)

    const todoDto: TodoDto = {
      id: newTodo.id,
      deadline: newTodo.deadline,
      done: newTodo.done,
      description: newTodo.description,
      snapshootImage: newTodo.snapshootImage,
      userId: newTodo.userId,
      user: null
    }

    res.status(201).json(todoDto)
  })
}
