const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API for CareerPath Pro',
    version: '0.2.0',
    description: 'This is the API documentation for the CareerPath Pro API.',
  },
  servers: [
    {
      url: 'http://localhost:3000/',
      description: 'Development server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./index.js'], 
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
