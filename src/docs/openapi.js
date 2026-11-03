const comum = require('./comum');
const tarefas = require('./tarefas.docs');
const auth = require('./auth.docs');
const projetos = require('./projetos.docs');
const usuarios = require('./usuarios.docs');

module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'TaskFlow API',
    version: '1.0.0',
    description: 'API do TaskFlow'
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Servidor Local'
    }
  ],
  security: [
    {
      bearerAuth: []
    }
  ],
  paths: {
    ...auth.paths,
    ...tarefas.paths,
    ...projetos.paths,
    ...usuarios.paths,
   
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      ...comum.schemas,
      ...auth.schemas,
      ...tarefas.schemas,
      ...projetos.schemas,
      ...usuarios.schemas,
      
    }
  }
};