import Joi from "joi";


/**
 * @swagger
 * components:
 *   schemas:
 *     SortType:
 *       type: string
 *       enum:
 *         - asc
 *         - desc
 */
export const getTodoSchema = Joi.object<{sortType: 'asc' | 'desc'}>({
  sortType: Joi.string().valid('asc', 'desc'),
})
