
const schemas = {
  Erro: {
    type: 'object',
    properties: {
      erro: {
        type: 'object',
        properties: {
          mensagem: {
            type: 'string',
            example: 'Recurso não encontrado'
          },
          detalhes: {
            type: 'array',
            items: {
              type: 'string'
            },
            example: ['O campo texto é de preenchimento obrigatório.']
          }
        }
      }
    }
  }
};

const json = (nomeSchema) => ({
  'application/json': {
    schema: {
      $ref: `#/components/schemas/${nomeSchema}`
    }
  }
});

const parametroId = {
  name: 'id',
  in: 'path',
  required: true,
  description: 'Identificador único do recurso',
  schema: {
    type: 'integer',
    example: 1
  }
};

module.exports = {
  schemas,
  json,
  parametroId
};