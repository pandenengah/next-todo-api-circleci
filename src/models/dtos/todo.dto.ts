/**
 * @swagger
 * components:
 *   schemas:
 *     TodoDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         description:
 *           type: string
 *         deadline:
 *           type: string
 *           format: date-time
 *         done:
 *           type: boolean
 *         snapshootImage:
 *           type: string
 *           nullable: true
 */
export interface TodoDto {
  id: string
  description: string
  deadline: string
  done: boolean
  snapshootImage: string
}
