const tarefaModel = require("../models/tarefasModel");
const usuarioModel = require("../models/usuariosModel");

const PRIORIDADES_VALIDAS = ["alta", "media", "baixa"];
const COLUNAS_VALIDAS = ["afazer", "andamento", "concluido"];

const tarefasController = {
  async listar(req, res) {
    try {
      const resultado = await tarefaModel.listar(req.query);
      res.json(resultado);
    } catch (error) {
  
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
      const usuarioId = req.usuario?.id; // ID extraído do token/middleware

      if (!texto) {
        return res.status(400).json({ erro: "O texto da tarefa é obrigatório" });
      }

      if (prioridade && !PRIORIDADES_VALIDAS.includes(prioridade)) {
        return res.status(400).json({ erro: "Prioridade inválida. Use: alta, media ou baixa" });
      }

      if (coluna && !COLUNAS_VALIDAS.includes(coluna)) {
        return res.status(400).json({ erro: "Coluna inválida. Use: afazer, andamento ou concluido" });
      }

      const usuarioExiste = await usuarioModel.buscar(usuarioId);
      if (!usuarioExiste) {
        return res.status(400).json({ erro: "Usuário não encontrado" });
      }

      // Validação do limite de tarefas em andamento
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
        usuarioId,
      });

      res.status(201).json(tarefa);
    } catch (error) {
      console.error("Erro detalhado no criar:", error);
      res.status(500).json({ erro: "Erro ao criar tarefa" });
    }
  },

  async atualizar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { prioridade, coluna, usuarioId } = req.body;

      if (prioridade && !PRIORIDADES_VALIDAS.includes(prioridade)) {
        return res.status(400).json({
          erro: "Prioridade inválida. Use: alta, media ou baixa",
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

      const usuarioAlvoId = usuarioId ? parseInt(usuarioId) : tarefaAtual.usuario_id;
      const proximaColuna = coluna || tarefaAtual.coluna;

      // Checa se a tarefa está indo para "andamento" ou trocando de usuário já estando em "andamento"
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
      res.status(500).json({ erro: "Erro ao atualizar tarefa" });
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
      res.status(500).json({ erro: "Erro ao buscar estatísticas" });
    }
  },
};

module.exports = tarefasController;