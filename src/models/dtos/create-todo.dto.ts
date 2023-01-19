import formidable from "formidable"

export interface CreateTodoDto {
  deadline: string
  description: string
  snapshootImage: formidable.File
}
