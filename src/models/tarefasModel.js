const pool = require('../database/db');

module.exports = {
  // 1. Listar tarefas (suporta filtros por ?coluna=...&usuarioId=...)
  listar: async (filtros = {}) => {
    const { coluna, usuarioId } = filtros;
    let query = 'SELECT * FROM tarefas';
    const values = [];
    const conditions = [];

    if (coluna) {
      values.push(coluna);
      conditions.push(`coluna = $${values.length}`);
    }

    if (usuarioId) {
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

  // 2. Buscar por ID
  buscar: async (id) => {
    const query = 'SELECT * FROM tarefas WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  },

  // 3. Adicionar nova tarefa
  adicionar: async ({ texto, prioridade = 'media', coluna = 'afazer', usuarioId, projetoId }) => {
    const query = `
      INSERT INTO tarefas (texto, prioridade, coluna, usuario_id, projeto_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [texto, prioridade, coluna, usuarioId, projetoId];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // 4. Atualizar tarefa dinamicamente
  atualizar: async (id, dados) => {
    const camposPermitidos = {
      texto: 'texto',
      prioridade: 'prioridade',
      coluna: 'coluna',
      usuarioId: 'usuario_id',
      projetoId: 'projeto_id'
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
      UPDATE tarefas 
      SET ${setClauses.join(', ')} 
      WHERE id = $${paramIndex} 
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  },

  // 5. Remover tarefa por ID
  remover: async (id) => {
    const query = 'DELETE FROM tarefas WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  },

  // 6. Contar tarefas atreladas a um usuário (usado ao deletar usuário)
  contarPorUsuario: async (usuarioId) => {
    const query = 'SELECT COUNT(*)::int AS total FROM tarefas WHERE usuario_id = $1';
    const result = await pool.query(query, [usuarioId]);
    return result.rows[0]?.total || 0;
  },

  // 7. Contar tarefas por Usuário e Coluna (usado para verificar limite de em andamento)
  contarPorUsuarioEColuna: async (usuarioId, coluna) => {
    const query = `
      SELECT COUNT(*)::int AS total 
      FROM tarefas 
      WHERE usuario_id = $1 AND coluna = $2
    `;
    const result = await pool.query(query, [usuarioId, coluna]);
    return result.rows[0]?.total || 0;
  },

  // 8. Obter estatísticas das tarefas
  obterEstatisticas: async (colunaFiltro) => {
    let query = 'SELECT coluna, COUNT(*)::int AS quantidade FROM tarefas';
    const values = [];

    if (colunaFiltro) {
      query += ' WHERE coluna = $1';
      values.push(colunaFiltro);
    }

    query += ' GROUP BY coluna';

    const result = await pool.query(query, values);
    return result.rows;
  }
};











































































// const usuarioModel = require("./usuariosModel"); 
// let tarefas = [
//   {
//     id: 1,
//     texto: "Fazer React",
//     prioridade: "alta",
//     coluna: "andamento",
//     cidade: "",
//     usuarioId: 1,
//     concluidaEm: null,
//   },
//   {
//     id: 2,
//     texto: "Construir api",
//     prioridade: "alta",
//     coluna: "andamento",
//     cidade: "",
//     usuarioId: 1,
//     concluidaEm: null,
//   },
//   {
//     id: 3,
//     texto: "Testar no Postman",
//     prioridade: "media",
//     coluna: "concluido",
//     cidade: "",
//     usuarioId: 1,
//     concluidaEm: "2026-03-01T10:00:00.000Z",
//   },
// ];

// let proximoId = 4;

// module.exports = {
//   listar: ({ coluna, prioridade, usuarioId } = {}) => {
//     if (usuarioId !== undefined) {
//       const usuarioExiste = usuarioModel.buscar(parseInt(usuarioId));
//       if (!usuarioExiste) return [];
//     }

//     let resultado = tarefas;

//     if (usuarioId !== undefined) {
//       resultado = resultado.filter((t) => t.usuarioId === parseInt(usuarioId));
//     }

//     if (coluna) {
//       resultado = resultado.filter((t) => (t.coluna || "afazer") === coluna);
//     }

//     if (prioridade) {
//       resultado = resultado.filter((t) => t.prioridade === prioridade);
//     }

//     return resultado;
//   },

//   listarPorColuna: (coluna) =>
//     tarefas.filter((t) => (t.coluna || "afazer") === coluna),

//   listarPorPrioridade: (prioridade) =>
//     tarefas.filter((t) => t.prioridade === prioridade),

//   buscar: (id) => tarefas.find((t) => t.id === id),

//   contarPorUsuario: (usuarioId) =>
//     tarefas.filter((t) => t.usuarioId === usuarioId).length,

//   contarPorUsuarioEColuna: (usuarioId, coluna) =>
//     tarefas.filter(
//       (t) => t.usuarioId === usuarioId && (t.coluna || "afazer") === coluna
//     ).length,

//   adicionar: ({ texto, prioridade, coluna, cidade, usuarioId }) => {
//     const nova = {
//       id: proximoId++,
//       texto,
//       prioridade: prioridade || "media",
//       coluna: coluna || "afazer",
//       cidade: cidade || "",
//       usuarioId,
//       concluidaEm: coluna === "concluido" ? new Date().toISOString() : null, // Corrigido: novaColuna -> coluna
//     };
//     tarefas.push(nova);
//     return nova;
//   },

//   atualizar: (id, dados) => {
//     const idx = tarefas.findIndex((t) => t.id === id);
//     if (idx === -1) return null;

//     let concluidaEm = tarefas[idx].concluidaEm || null;

//     if (dados.coluna !== undefined) {
//       if (dados.coluna === "concluido") {
//         concluidaEm = new Date().toISOString();
//       } else {
//         concluidaEm = null;
//       }
//     }

//     tarefas[idx] = {
//       ...tarefas[idx],
//       ...dados,
//       id,
//       concluidaEm,
//     };

//     return tarefas[idx];
//   },

//   remover: (id) => {
//     const idx = tarefas.findIndex((t) => t.id === id);
//     if (idx === -1) return null;

//     return tarefas.splice(idx, 1)[0];
//   },

//   obterEstatisticas: (coluna) => {
//     const base = coluna
//       ? tarefas.filter((t) => (t.coluna || "afazer") === coluna)
//       : tarefas;

//     const total = base.length;

//     const porColuna = {
//       afazer: base.filter((t) => (t.coluna || "afazer") === "afazer").length,
//       andamento: base.filter((t) => t.coluna === "andamento").length,
//       concluido: base.filter((t) => t.coluna === "concluido").length,
//     };

//     const porPrioridade = {
//       alta: base.filter((t) => t.prioridade === "alta").length,
//       media: base.filter((t) => t.prioridade === "media").length,
//       baixa: base.filter((t) => t.prioridade === "baixa").length,
//     };

//     const colunaMaisTarefas = Object.entries(porColuna).sort(
//       (a, b) => b[1] - a[1]
//     )[0][0];

//     return {
//       total,
//       porColuna,
//       porPrioridade,
//       colunaMaisTarefas,
//     };
//   },
// };