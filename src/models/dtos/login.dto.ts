/**
 * @swagger
 * components:
 *   schemas:
 *     LoginDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         email:
 *           type: string
 *           format: email
 *         fullName:
 *           type: string
 *         accessToken:
 *           type: string
 */
export interface LoginDto {
  id: string
  email: string
  fullName: string
  accessToken: string
}
