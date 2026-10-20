// let usuarios = [
//   { id: 1, 
//     nome: "user",
//     email: "admin@gmail.com", 
//     senha: "1234"
//    },

// ];

// let proximoId = 2;

// module.exports = {
//   listar: ({ nome, email } = {}) => {
//     let resultado = usuarios;

//     if (nome) {
//       resultado = resultado.filter((u) => u.nome === nome);
//     }
//     if (email) {
//       resultado = resultado.filter((u) => u.email === email);
//     }

//     return resultado;
//   },

//   buscar: (id) => usuarios.find((u) => u.id === id),

//   buscarPorEmail: (email) => usuarios.find((u) => u.email === email),

//   adicionar: ({ nome, email, senha }) => {
//     const novo = {
//       id: proximoId++,
//       nome: nome || "Gilberto",
//       email: email || "admin@123gmail.com",
//       senha: senha || "1234",
//     };
//     usuarios.push(novo);
//     return novo;
//   },

//   atualizar: (id, dados) => {
//     const idx = usuarios.findIndex((u) => u.id === id);
//     if (idx === -1) return null;

//     usuarios[idx] = { id, ...dados };
//     return usuarios[idx];
//   },

//   remover: (id) => {
//     const idx = usuarios.findIndex((u) => u.id === id);
//     if (idx === -1) return null;

//     return usuarios.splice(idx, 1)[0];
//   },
// };

// const criarTarefa = async ({ texto, prioridade, coluna, usuarioId, projetoId }) => {
//   const result = await pool.query(
//     `INSERT INTO tarefas (texto, prioridade, coluna, usuario_id, projeto_id) 
//      VALUES ($1, $2, $3, $4, $5) 
//      RETURNING *`,
//     [texto, prioridade || 'media', coluna || 'afazer', usuarioId, projetoId]
//   );

//   return result.rows[0];
// };









const pool = require('../database/db');

module.exports = {

  listar: async (filtros = {}) => {
    const { nome, email } = filtros;
    let query = 'SELECT id, nome, email, criado_em FROM teste.usuarios'; // <-- teste.usuarios
    const values = [];
    const conditions = [];

    if (nome) {
      values.push(`%${nome}%`);
      conditions.push(`nome ILIKE $${values.length}`);
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
    const query = 'SELECT id, nome, email, criado_em FROM teste.usuarios WHERE id = $1'; // <-- teste.usuarios
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  },

  buscarPorEmail: async (email) => {
    const query = 'SELECT * FROM teste.usuarios WHERE email = $1'; // <-- teste.usuarios
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  },

  adicionar: async ({ nome = "Gilberto", email, senha }) => {
    const query = `
      INSERT INTO teste.usuarios (nome, email, senha)
      VALUES ($1, $2, $3)
      RETURNING id, nome, email, criado_em
    `; // <-- teste.usuarios
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
      UPDATE teste.usuarios 
      SET ${setClauses.join(', ')} 
      WHERE id = $${paramIndex} 
      RETURNING id, nome, email, criado_em
    `; // <-- teste.usuarios

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  },

  remover: async (id) => {
    const query = 'DELETE FROM teste.usuarios WHERE id = $1 RETURNING id, nome, email'; // <-- teste.usuarios
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }
};