const pool = require('../database/db');

module.exports = {

  listar: async ({ coluna, prioridade, usuarioId } = {}) => {
    let query = `
      SELECT id, texto, prioridade, coluna, cidade, 
             usuario_id AS "usuarioId", 
             concluida_em AS "concluidaEm" 
      FROM tarefas
    `;
    const values = [];
    const conditions = [];

    if (coluna) {
      values.push(coluna);
      conditions.push(`coluna = $${values.length}`);
    }

    if (prioridade) {
      values.push(prioridade);
      conditions.push(`prioridade = $${values.length}`);
    }

    if (usuarioId !== undefined) {
      values.push(usuarioId);
      conditions.push(`usuario_id = $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY id ASC';

    const result = await pool.query(query, values);
    return result.rows;
  },

  listarPorColuna: async (coluna) => {
    const query = `
      SELECT id, texto, prioridade, coluna, cidade, 
             usuario_id AS "usuarioId", 
             concluida_em AS "concluidaEm" 
      FROM tarefas 
      WHERE coluna = $1 
      ORDER BY id ASC
    `;
    const result = await pool.query(query, [coluna]);
    return result.rows;
  },

  listarPorPrioridade: async (prioridade) => {
    const query = `
      SELECT id, texto, prioridade, coluna, cidade, 
             usuario_id AS "usuarioId", 
             concluida_em AS "concluidaEm" 
      FROM tarefas 
      WHERE prioridade = $1 
      ORDER BY id ASC
    `;
    const result = await pool.query(query, [prioridade]);
    return result.rows;
  },

  buscar: async (id) => {
    const query = `
      SELECT id, texto, prioridade, coluna, cidade, 
             usuario_id AS "usuarioId", 
             concluida_em AS "concluidaEm" 
      FROM tarefas 
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  },

  contarPorUsuario: async (usuarioId) => {
    const query = 'SELECT COUNT(*)::int AS total FROM tarefas WHERE usuario_id = $1';
    const result = await pool.query(query, [usuarioId]);
    return result.rows[0]?.total || 0;
  },

  contarPorUsuarioEColuna: async (usuarioId, coluna) => {
    const query = `
      SELECT COUNT(*)::int AS total 
      FROM tarefas 
      WHERE usuario_id = $1 AND coluna = $2
    `;
    const result = await pool.query(query, [usuarioId, coluna]);
    return result.rows[0]?.total || 0;
  },

  adicionar: async ({ texto, prioridade = 'media', coluna = 'afazer', cidade = '', usuarioId }) => {
    const concluidaEm = coluna === 'concluido' ? new Date().toISOString() : null;

    const query = `
      INSERT INTO tarefas (texto, prioridade, coluna, cidade, usuario_id, concluida_em)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, texto, prioridade, coluna, cidade, 
                usuario_id AS "usuarioId", 
                concluida_em AS "concluidaEm"
    `;
    const values = [texto, prioridade, coluna, cidade, usuarioId, concluidaEm];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  atualizar: async (id, dados) => {
    const mapaCampos = {
      texto: 'texto',
      prioridade: 'prioridade',
      coluna: 'coluna',
      cidade: 'cidade',
      usuarioId: 'usuario_id'
    };

    const setClauses = [];
    const values = [];
    let paramIndex = 1;

    for (const [chave, colunaBanco] of Object.entries(mapaCampos)) {
      if (dados[chave] !== undefined) {
        setClauses.push(`${colunaBanco} = $${paramIndex}`);
        values.push(dados[chave]);
        paramIndex++;
      }
    }

    if (dados.coluna !== undefined) {
      const concluidaEm = dados.coluna === 'concluido' ? new Date().toISOString() : null;
      setClauses.push(`concluida_em = $${paramIndex}`);
      values.push(concluidaEm);
      paramIndex++;
    }

    if (setClauses.length === 0) return null;

    values.push(id);
    const query = `
      UPDATE tarefas 
      SET ${setClauses.join(', ')} 
      WHERE id = $${paramIndex} 
      RETURNING id, texto, prioridade, coluna, cidade, 
                usuario_id AS "usuarioId", 
                concluida_em AS "concluidaEm"
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  },

  remover: async (id) => {
    const query = `
      DELETE FROM tarefas 
      WHERE id = $1 
      RETURNING id, texto, prioridade, coluna, cidade, 
                usuario_id AS "usuarioId", 
                concluida_em AS "concluidaEm"
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  },

  // 10. Obter estatísticas
  obterEstatisticas: async (colunaFiltro) => {
    let query = 'SELECT coluna, prioridade FROM tarefas';
    const values = [];

    if (colunaFiltro) {
      query += ' WHERE coluna = $1';
      values.push(colunaFiltro);
    }

    const result = await pool.query(query, values);
    const rows = result.rows;

    const porColuna = {
      afazer: rows.filter((t) => (t.coluna || 'afazer') === 'afazer').length,
      andamento: rows.filter((t) => t.coluna === 'andamento').length,
      concluido: rows.filter((t) => t.coluna === 'concluido').length,
    };

    const porPrioridade = {
      alta: rows.filter((t) => t.prioridade === 'alta').length,
      media: rows.filter((t) => t.prioridade === 'media').length,
      baixa: rows.filter((t) => t.prioridade === 'baixa').length,
    };

    const colunaMaisTarefas = Object.entries(porColuna).sort(
      (a, b) => b[1] - a[1]
    )[0][0];

    return {
      total: rows.length,
      porColuna,
      porPrioridade,
      colunaMaisTarefas,
    };
  }
};