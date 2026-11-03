const { json, parametroId } = require('./comum');

const schemas = {
  Tarefa: {
    type: 'object',
    properties: {
      id: { type: 'integer', example: 1 },
      texto: { type: 'string', example: 'Revisar layout da aplicação' },
      coluna: { type: 'string', enum: ['afazer', 'andamento', 'concluido'], example: 'afazer' },
      iniciada_em: { type: 'string', format: 'date-time', nullable: true, example: '2026-11-03T10:00:00.000Z' },
      concluida_em: { type: 'string', format: 'date-time', nullable: true, example: null },
      usuario_id: { type: 'integer', example: 2 },
      projeto_id: { type: 'integer', example: 1 },
      idprioridade: { type: 'integer', example: 3 },
      criado_em: { type: 'string', format: 'date-time', example: '2026-11-01T08:30:00.000Z' },
      atualizado_em: { type: 'string', format: 'date-time', example: '2026-11-02T14:15:00.000Z' }
    }
  },
  TarefaEntrada: {
    type: 'object',
    required: ['texto', 'coluna', 'usuario_id', 'projeto_id', 'idprioridade'],
    properties: {
      texto: { type: 'string', example: 'Revisar layout da aplicação' },
      coluna: { type: 'string', enum: ['afazer', 'andamento', 'concluido'], example: 'afazer' },
      usuario_id: { type: 'integer', example: 2 },
      projeto_id: { type: 'integer', example: 1 },
      idprioridade: { type: 'integer', example: 3 }
    }
  }
};

const paths = {
  '/tarefas': {
    get: {
      tags: ['Tarefas'],
      summary: 'Lista todas as tarefas',
      description: 'Retorna a lista de tarefas filtrando opcionalmente pelo ID do utilizador.',
      parameters: [
        {
          name: 'usuario_id',
          in: 'query',
          required: false,
          description: 'Filtro por ID de utilizador',
          schema: {
            type: 'integer',
            example: 1
          }
        }
      ],
      responses: {
        '200': {
          description: 'Lista de tarefas obtida com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Tarefa'
                }
              }
            }
          }
        },
        '401': {
          description: 'Token de autenticação ausente ou inválido',
          content: json('Erro')
        }
      }
    },
    post: {
      tags: ['Tarefas'],
      summary: 'Cria uma nova tarefa',
      requestBody: {
        required: true,
        content: json('TarefaEntrada')
      },
      responses: {
        '201': {
          description: 'Tarefa criada com sucesso',
          content: json('Tarefa')
        },
        '400': {
          description: 'Dados de entrada inválidos',
          content: json('Erro')
        },
        '401': {
          description: 'Token ausente ou inválido',
          content: json('Erro')
        },
        '415': {
          description: 'Content-Type deve ser application/json',
          content: json('Erro')
        }
      }
    }
  },
  '/tarefas/{id}': {
    get: {
      tags: ['Tarefas'],
      summary: 'Busca uma tarefa pelo ID',
      parameters: [parametroId],
      responses: {
        '200': {
          description: 'Tarefa encontrada',
          content: json('Tarefa')
        },
        '400': {
          description: 'ID inválido',
          content: json('Erro')
        },
        '401': {
          description: 'Token ausente ou inválido',
          content: json('Erro')
        },
        '404': {
          description: 'Tarefa não encontrada',
          content: json('Erro')
        }
      }
    },
    put: {
      tags: ['Tarefas'],
      summary: 'Atualiza uma tarefa',
      parameters: [parametroId],
      requestBody: {
        required: true,
        content: json('TarefaEntrada')
      },
      responses: {
        '200': {
          description: 'Tarefa atualizada com sucesso',
          content: json('Tarefa')
        },
        '400': {
          description: 'Dados de entrada ou ID inválidos',
          content: json('Erro')
        },
        '401': {
          description: 'Token ausente ou inválido',
          content: json('Erro')
        },
        '404': {
          description: 'Tarefa não encontrada',
          content: json('Erro')
        },
        '415': {
          description: 'Content-Type deve ser application/json',
          content: json('Erro')
        }
      }
    },
    delete: {
      tags: ['Tarefas'],
      summary: 'Exclui uma tarefa',
      parameters: [parametroId],
      responses: {
        '200': {
          description: 'Tarefa excluída',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  mensagem: { type: 'string', example: 'Tarefa removida' },
                  tarefa: { $ref: '#/components/schemas/Tarefa' }
                }
              }
            }
          }
        },
        '401': {
          description: 'Token ausente ou inválido',
          content: json('Erro')
        },
        '404': {
          description: 'Tarefa não encontrada',
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