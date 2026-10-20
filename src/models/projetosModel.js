// 




const pool = require('../database/db');

module.exports = {
  // 1. Listar todos os projetos (suporta filtros ?descricao=...&ativo=true)
  listar: async (filtros = {}) => {
    const { descricao, ativo } = filtros;
    let query = 'SELECT * FROM projetos';
    const values = [];
    const conditions = [];

    if (descricao) {
      values.push(`%${descricao}%`);
      conditions.push(`descricao ILIKE $${values.length}`);
    }

    if (ativo !== undefined) {
      values.push(ativo === 'true' || ativo === true);
      conditions.push(`ativo = $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY id ASC';

    const result = await pool.query(query, values);
    return result.rows;
  },

  // 2. Buscar projeto por ID
  buscar: async (id) => {
    const query = 'SELECT * FROM projetos WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  },

  // 3. Adicionar novo projeto
  adicionar: async ({ descricao = "teste esse projeto", ativo = true }) => {
    const query = `
      INSERT INTO projetos (descricao, ativo)
      VALUES ($1, $2)
      RETURNING *
    `;
    const values = [descricao, ativo];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // 4. Atualizar projeto dinamicamente
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
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  },

 
  remover: async (id) => {
    const query = 'DELETE FROM projetos WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }
};