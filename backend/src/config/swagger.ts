import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: ' Backend API',
      version: '1.0.0',
      description: 'API documentation for  Backend',
    },
    servers: [
      {
        url: 'https://staging-api.example.com/',
        description: 'The staging environment ',
      },
      {
        url: 'https://prod-api.example.com/',
        description: 'The production environment ',
      },
      {
        url: 'http://localhost:5005',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
