const { json, parametroId } = require('./comum');

const schemas = {
  Usuario: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      nome: { type: 'string', example: 'Carlos Eduardo' },
      email: { type: 'string', format: 'email', example: 'carlos@taskflow.com' },
      criado_em: { type: 'string', format: 'date-time', example: '2026-10-01T09:00:00.000Z' }
    }
  },
  UsuarioEntrada: {
    type: 'object',
    required: ['nome', 'email', 'senha'],
    properties: {
      nome: { type: 'string', example: 'Carlos Eduardo' },
      email: { type: 'string', format: 'email', example: 'carlos@taskflow.com' },
      senha: { type: 'string', example: 'senhaSegura123' }
    }
  }
};

const paths = {
  '/usuarios': {
    get: {
      tags: ['Usuários'],
      summary: 'Lista todos os utilizadores',
      responses: {
        '200': {
          description: 'Lista de utilizadores',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/Usuario' }
              }
            }
          }
        },
        '401': {
          description: 'Token ausente ou inválido',
          content: json('Erro')
        }
      }
    },
    post: {
      tags: ['Usuários'],
      summary: 'Regista um novo utilizador',
      security: [],
      requestBody: {
        required: true,
        content: json('UsuarioEntrada')
      },
      responses: {
        '201': {
          description: 'Utilizador registado',
          content: json('Usuario')
        },
        '400': {
          description: 'Dados inválidos ou e-mail já registado',
          content: json('Erro')
        }
      }
    }
  },
  '/usuarios/{id}': {
    get: {
      tags: ['Usuários'],
      summary: 'Busca um utilizador pelo ID',
      parameters: [parametroId],
      responses: {
        '200': {
          description: 'Utilizador encontrado',
          content: json('Usuario')
        },
        '404': {
          description: 'Utilizador não encontrado',
          content: json('Erro')
        }
      }
    },
    put: {
      tags: ['Usuários'],
      summary: 'Atualiza um utilizador',
      parameters: [parametroId],
      requestBody: {
        required: true,
        content: json('UsuarioEntrada')
      },
      responses: {
        '200': {
          description: 'Utilizador atualizado',
          content: json('Usuario')
        },
        '404': {
          description: 'Utilizador não encontrado',
          content: json('Erro')
        }
      }
    },
    delete: {
      tags: ['Usuários'],
      summary: 'Exclui um utilizador',
      parameters: [parametroId],
      responses: {
        '200': {
          description: 'Utilizador excluído',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  mensagem: { type: 'string', example: 'Utilizador removido' }
                }
              }
            }
          }
        },
        '404': {
          description: 'Utilizador não encontrado',
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