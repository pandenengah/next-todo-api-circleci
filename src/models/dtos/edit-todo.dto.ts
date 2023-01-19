import formidable from "formidable"

export interface EditTodoDto {
  deadline: string
  description: string
  done: boolean
  snapshootImage: formidable.File
}
