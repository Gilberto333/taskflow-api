


const usuarioModel = require("../models/usuariosModel");
const tarefaModel = require("../models/tarefasModel");

const usuariosController = {
  async listar(req, res) {
    try {
      const resultado = await usuarioModel.listar(req.query);
      res.json(resultado);
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      res.status(500).json({ erro: "Erro ao buscar usuários" });
    }
  },

  async buscarPorId(req, res) {
    try {
      const id = parseInt(req.params.id);
      const usuario = await usuarioModel.buscar(id);

      if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      res.json(usuario);
    } catch (error) {
      console.error("Erro ao buscar usuário por ID:", error);
      res.status(500).json({ erro: "Erro ao buscar o usuário" });
    }
  },

 async criar(req, res) {
    try {
      const { email } = req.body;

      if (email) {
        const usuarioExistente = await usuarioModel.buscarPorEmail(email);
        if (usuarioExistente) {
          return res.status(400).json({
            erro: "Este email já está cadastrado",
          });
        }
      }

      const novoUsuario = await usuarioModel.adicionar(req.body);
      res.status(201).json(novoUsuario);
    } catch (error) {
      console.error("Erro ao criar usuário:", error); // <-- Adicionado para ver o erro no terminal
      res.status(500).json({ erro: "Erro ao criar usuário" });
    }
  },

  async atualizar(req, res) {
    try {
      const id = parseInt(req.params.id);

      const usuarioAtual = await usuarioModel.buscar(id);
      if (!usuarioAtual) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      const usuarioAtualizado = await usuarioModel.atualizar(id, req.body);
      res.json(usuarioAtualizado);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      res.status(500).json({ erro: "Erro ao atualizar usuário" });
    }
  },

  async remover(req, res) {
    try {
      const id = parseInt(req.params.id);

      const usuario = await usuarioModel.buscar(id);
      if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }

      
      const qtdTarefas = await tarefaModel.contarPorUsuario(id);

      if (qtdTarefas > 0) {
        return res.status(400).json({
          erro: "Usuário possui tarefas. Remova as tarefas antes.",
        });
      }

      await usuarioModel.remover(id);

      res.json({ mensagem: "Usuário removido com sucesso", id });
    } catch (error) {
      console.error("Erro ao remover usuário:", error);
      res.status(500).json({ erro: "Erro ao remover usuário" });
    }
  },
};

module.exports = usuariosController;
