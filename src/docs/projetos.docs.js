const { json, parametroId } = require('./comum');

const schemas = {
  Projeto: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      nome: { type: 'string', example: 'API TaskFlow' },
      descricao: { type: 'string', example: 'Desenvolvimento do backend e documentação Swagger' },
      criado_em: { type: 'string', format: 'date-time', example: '2026-10-15T12:00:00.000Z' }
    }
  },
  ProjetoEntrada: {
    type: 'object',
    required: ['nome'],
    properties: {
      nome: { type: 'string', example: 'API TaskFlow' },
      descricao: { type: 'string', example: 'Desenvolvimento do backend e documentação Swagger' }
    }
  }
};

const paths = {
  '/projetos': {
    get: {
      tags: ['Projetos'],
      summary: 'Lista todos os projetos',
      responses: {
        '200': {
          description: 'Lista de projetos',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/Projeto' }
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
      tags: ['Projetos'],
      summary: 'Cria um novo projeto',
      requestBody: {
        required: true,
        content: json('ProjetoEntrada')
      },
      responses: {
        '201': {
          description: 'Projeto criado',
          content: json('Projeto')
        },
        '400': {
          description: 'Dados inválidos',
          content: json('Erro')
        },
        '401': {
          description: 'Token ausente ou inválido',
          content: json('Erro')
        }
      }
    }
  },
  '/projetos/{id}': {
    get: {
      tags: ['Projetos'],
      summary: 'Busca um projeto pelo ID',
      parameters: [parametroId],
      responses: {
        '200': {
          description: 'Projeto encontrado',
          content: json('Projeto')
        },
        '404': {
          description: 'Projeto não encontrado',
          content: json('Erro')
        }
      }
    },
    put: {
      tags: ['Projetos'],
      summary: 'Atualiza um projeto',
      parameters: [parametroId],
      requestBody: {
        required: true,
        content: json('ProjetoEntrada')
      },
      responses: {
        '200': {
          description: 'Projeto atualizado',
          content: json('Projeto')
        },
        '404': {
          description: 'Projeto não encontrado',
          content: json('Erro')
        }
      }
    },
    delete: {
      tags: ['Projetos'],
      summary: 'Remove um projeto',
      parameters: [parametroId],
      responses: {
        '200': {
          description: 'Projeto removido',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  mensagem: { type: 'string', example: 'Projeto removido' }
                }
              }
            }
          }
        },
        '404': {
          description: 'Projeto não encontrado',
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