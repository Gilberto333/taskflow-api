const tarefaModel = require("../models/tarefasModel");
const usuarioModel = require("../models/usuariosModel");

const PRIORIDADES_VALIDAS = ["alta", "media", "baixa"];
const COLUNAS_VALIDAS = ["afazer", "andamento", "concluido"];

function obterUsuarioId(req) {
  const candidatos = [
    req.body?.usuario_id,
    req.body?.usuarioId,
    req.body?.idusuario,
    req.body?.usuario,
    req.usuario?.id,
  ];

  for (const val of candidatos) {
    if (val !== undefined && val !== null && val !== "" && typeof val !== "boolean") {
      const num = Number(val);
      if (!isNaN(num) && num > 0) return num;
    }
  }
  return null;
}

function prioridadeValida(prioridade) {
  if (prioridade === undefined || prioridade === null || prioridade === "") return true;
  if (typeof prioridade !== "boolean" && !isNaN(Number(prioridade))) {
    return Number(prioridade) > 0;
  }
  return PRIORIDADES_VALIDAS.includes(String(prioridade).trim().toLowerCase());
}

const tarefasController = {
  async listar(req, res) {
    try {
      const resultado = await tarefaModel.listar(req.query);
      res.json(resultado);
    } catch (error) {
      console.error("Erro ao listar tarefas:", error);
      res.status(500).json({ erro: "Erro ao buscar tarefas" });
    }
  },

  async buscarPorId(req, res) {
    try {
      const id = parseInt(req.params.id);
      const tarefa = await tarefaModel.buscar(id);

      if (!tarefa) {
        return res.status(404).json({ erro: "Tarefa não encontrada" });
      }

      res.json(tarefa);
    } catch (error) {
      res.status(500).json({ erro: "Erro ao buscar a tarefa" });
    }
  },

  async criar(req, res) {
    try {
      const { texto, prioridade, coluna } = req.body;
      const usuarioId = obterUsuarioId(req);

      if (!texto) {
        return res.status(400).json({ erro: "O texto da tarefa é obrigatório" });
      }

      if (!prioridadeValida(prioridade)) {
        return res.status(400).json({ erro: "Prioridade inválida. Use: alta, media, baixa ou um ID válido" });
      }

      if (coluna && !COLUNAS_VALIDAS.includes(coluna)) {
        return res.status(400).json({ erro: "Coluna inválida. Use: afazer, andamento ou concluido" });
      }

      if (!usuarioId) {
        return res.status(400).json({ erro: "O usuário da tarefa é obrigatório" });
      }

      const usuarioExiste = await usuarioModel.buscar(usuarioId);
      if (!usuarioExiste) {
        return res.status(400).json({ erro: "Usuário não encontrado" });
      }

      if (coluna === "andamento") {
        const totalAndamento = await tarefaModel.contarPorUsuarioEColuna(
          usuarioId,
          "andamento"
        );

        if (totalAndamento >= 2) {
          return res.status(400).json({
            erro: "Limite de 2 tarefas em andamento por usuário atingido",
          });
        }
      }

      const tarefa = await tarefaModel.adicionar({
        ...req.body,
        usuario_id: usuarioId,
      });

      res.status(201).json(tarefa);
    } catch (error) {
      console.error("Erro detalhado no criar:", error);
      const isValidacao =
        error.message?.includes("obrigatório") ||
        error.message?.includes("não existe");
      res.status(isValidacao ? 400 : 500).json({
        erro: isValidacao ? error.message : "Erro ao criar tarefa",
        detalhe: error.message,
      });
    }
  },

  async atualizar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { prioridade, coluna } = req.body;

      if (!prioridadeValida(prioridade)) {
        return res.status(400).json({
          erro: "Prioridade inválida. Use: alta, media, baixa ou um ID válido",
        });
      }

      if (coluna && !COLUNAS_VALIDAS.includes(coluna)) {
        return res.status(400).json({
          erro: "Coluna inválida. Use: afazer, andamento ou concluido",
        });
      }

      const tarefaAtual = await tarefaModel.buscar(id);
      if (!tarefaAtual) {
        return res.status(404).json({ erro: "Tarefa não encontrada" });
      }

      const usuarioBodyId = obterUsuarioId({ body: req.body });
      const usuarioAlvoId = usuarioBodyId || tarefaAtual.usuario_id;
      const proximaColuna = coluna || tarefaAtual.coluna;

      const mudouParaAndamento = proximaColuna === "andamento" && tarefaAtual.coluna !== "andamento";
      const trocouUsuarioEmAndamento = proximaColuna === "andamento" && usuarioAlvoId !== tarefaAtual.usuario_id;

      if (mudouParaAndamento || trocouUsuarioEmAndamento) {
        const totalAndamento = await tarefaModel.contarPorUsuarioEColuna(
          usuarioAlvoId,
          "andamento"
        );

        if (totalAndamento >= 2) {
          return res.status(400).json({
            erro: "Limite de 2 tarefas em andamento por usuário atingido",
          });
        }
      }

      const atualizada = await tarefaModel.atualizar(id, req.body);
      res.json(atualizada);
    } catch (error) {
      console.error("Erro detalhado no atualizar:", error);
      res.status(500).json({ erro: "Erro ao atualizar tarefa", detalhe: error.message });
    }
  },

  async remover(req, res) {
    try {
      const id = parseInt(req.params.id);
      const removida = await tarefaModel.remover(id);

      if (!removida) {
        return res.status(404).json({ erro: "Tarefa não encontrada" });
      }

      res.json({ mensagem: "Tarefa removida com sucesso", tarefa: removida });
    } catch (error) {
      res.status(500).json({ erro: "Erro ao remover tarefa" });
    }
  },

  async estatisticas(req, res) {
    try {
      const dadosEstatistcos = await tarefaModel.obterEstatisticas(req.query.coluna);
      res.json(dadosEstatistcos);
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      res.status(500).json({ erro: "Erro ao buscar estatísticas" });
    }
  },
};

module.exports = tarefasController;