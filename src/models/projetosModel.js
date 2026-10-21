const pool = require('../database/db');

module.exports = {
  listar: async () => {
    const query = 'SELECT id, descricao, ativo FROM projetos ORDER BY id ASC';
    const result = await pool.query(query);
    return result.rows;
  },

  buscar: async (id) => {
    const query = 'SELECT id, descricao, ativo FROM projetos WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  },

  adicionar: async ({ descricao = 'teste esse projeto', ativo }) => {
    const statusAtivo = ativo !== undefined ? ativo : true;
    const query = `
      INSERT INTO projetos (descricao, ativo)
      VALUES ($1, $2)
      RETURNING id, descricao, ativo
    `;
    const values = [descricao, statusAtivo];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  atualizar: async (id, dados) => {
    const camposPermitidos = {
      descricao: 'descricao',
      ativo: 'ativo'
    };

    const setClauses = [];
    const values = [];
    let paramIndex = 1;

    for (const [chave, colunaBanco] of Object.entries(camposPermitidos)) {
      if (dados[chave] !== undefined) {
        setClauses.push(`${colunaBanco} = $${paramIndex}`);
        values.push(dados[chave]);
        paramIndex++;
      }
    }

    if (setClauses.length === 0) return null;

    values.push(id);
    const query = `
      UPDATE projetos 
      SET ${setClauses.join(', ')} 
      WHERE id = $${paramIndex} 
      RETURNING id, descricao, ativo
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  },

  remover: async (id) => {
    const query = 'DELETE FROM projetos WHERE id = $1 RETURNING id, descricao, ativo';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }
};