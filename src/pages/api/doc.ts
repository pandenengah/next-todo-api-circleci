import { withSwagger } from 'next-swagger-doc';


let description = "With NextJS by Swagger.\n\n" +
  "`Image Path: https://{baseDomain}/`"
if (process.env.IS_IN_SERVERLESS === 'true') {
  description = "With NextJS by Swagger.\n\n" +
    "_Please note that some file image that uploaded here will be replaced with static random image, since this API is hosted on Serveless Functions._\n\n" +
    "`Image Path: https://picsum.photos/`"
}

const swaggerHandler = withSwagger({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo API',
      description,
      version: '1.0.2',
    },
    components: {
      securitySchemes: {
        oauth2: {
          type: "apiKey",
          description: "Standard Authorization header using the Bearer scheme (\"Bearer {token}\")",
          name: "Authorization",
          in: "header"
        }
      }
    }
  },
  apiFolder: 'src',
});
export default swaggerHandler();
