import { ValidationError } from "@/models/validation-error";
import Joi from "joi";


export const res400ValidationError = (error: Joi.ValidationError): ValidationError => {
  return {
    status: 400,
    title: "Validation errors occurred",
    message: error?.details[0]?.message || '',
    errors: error.details
  }
}
