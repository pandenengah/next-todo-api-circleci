import { withSwagger } from 'next-swagger-doc';

const swaggerHandler = withSwagger({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo API',
      description: 'With NextJS by Swagger',
      version: '1.0.1',
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
