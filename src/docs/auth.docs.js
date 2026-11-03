const { json } = require('./comum');

const schemas = {
  LoginEntrada: {
    type: 'object',
    required: ['email', 'senha'],
    properties: {
      email: { type: 'string', format: 'email', example: 'usuario@taskflow.com' },
      senha: { type: 'string', example: '123456' }
    }
  },
  LoginResposta: {
    type: 'object',
    properties: {
      token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
      usuario: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          nome: { type: 'string', example: 'Ana Silva' },
          email: { type: 'string', example: 'usuario@taskflow.com' }
        }
      }
    }
  }
};

const paths = {
  '/auth/login': {
    post: {
      tags: ['Autenticação'],
      summary: 'Realiza autenticação de utilizador',
      security: [], 
      requestBody: {
        required: true,
        content: json('LoginEntrada')
      },
      responses: {
        '200': {
          description: 'Login efetuado com sucesso',
          content: json('LoginResposta')
        },
        '401': {
          description: 'Credenciais incorretas',
          content: json('Erro')
        },
        '400': {
          description: 'Campos obrigatórios ausentes',
          content: json('Erro')
        }
      }
    }
  }
};

module.exports = {
  paths,
  schemas
};