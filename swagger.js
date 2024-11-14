import swaggerJSDoc from "swagger-jsdoc";


const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Swagger Express API',
        version: '1.0.0',
        description: 'A simple Express API with Swagger documentation',
      },
      servers: [
        {
          url: 'http://localhost:4000', // Update with your server URL
        },
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [
        {
          BearerAuth: [],
        },
      ],
    },
    apis: ['./routes/v1/*/*.js'], // Adjust path as needed
  };
  
  export const specs = swaggerJSDoc(options);
  
