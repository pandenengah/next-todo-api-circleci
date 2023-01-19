import Joi from "joi"

export interface ValidationError {
  status: number
  title: string
  message: string
  errors: Joi.ValidationErrorItem[]
}
