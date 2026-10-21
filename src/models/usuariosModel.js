const pool = require('../database/db');

module.exports = {
  listar: async ({ nome, email } = {}) => {
    let query = 'SELECT id, nome, email, senha FROM usuarios';
    const values = [];
    const conditions = [];

    if (nome) {
      values.push(nome);
      conditions.push(`nome = $${values.length}`);
    }

    if (email) {
      values.push(email);
      conditions.push(`email = $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY id ASC';

    const result = await pool.query(query, values);
    return result.rows;
  },

  buscar: async (id) => {
    const query = 'SELECT id, nome, email, senha FROM usuarios WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  },

  buscarPorEmail: async (email) => {
    const query = 'SELECT id, nome, email, senha FROM usuarios WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  },

  adicionar: async ({ nome = 'lucas', email = 'admin@.com', senha = '1234' }) => {
    const query = `
      INSERT INTO usuarios (nome, email, senha)
      VALUES ($1, $2, $3)
      RETURNING id, nome, email, senha
    `;
    const values = [nome, email, senha];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  atualizar: async (id, dados) => {
    const camposPermitidos = {
      nome: 'nome',
      email: 'email',
      senha: 'senha'
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
      UPDATE usuarios 
      SET ${setClauses.join(', ')} 
      WHERE id = $${paramIndex} 
      RETURNING id, nome, email, senha
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  },

  remover: async (id) => {
    const query = 'DELETE FROM usuarios WHERE id = $1 RETURNING id, nome, email, senha';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }
};