const UsuarioModel = require("../models/usuariosModel")

function listarUsuarios(req, res) {
    const usuarios = UsuarioModel.listarUsuarios()
    return res.json(usuarios)
}

function listarUsuariosId(req, res) {
    const id = parseInt(req.params.id)
    const usuario = UsuarioModel.buscarPorId(id)
    
    if (!usuario) {
        return res.status(404).json({ mensagem: "Usuário não encontrado!" })
    }
    return res.json(usuario)
}

function criarUsuario(req, res) {
    const { nome, email, senha } = req.body
    const novoUsuario = UsuarioModel.criarUsuario({ nome, email, senha })
    
    return res.status(200).json(novoUsuario)
}

function editarUsuario(req, res) {
    const id = parseInt(req.params.id);
    const { nome, email, senha } = req.body;
    
    const usuarioAtualizado = UsuarioModel.editarUsuario(id, { nome, email, senha });

    if (!usuarioAtualizado) {
        return res.status(404).json({ erro: "Usuário não encontrado." });
    }
    
    return res.status(200).json(usuarioAtualizado);
}

function deletarUsuario(req, res) {
    const id = parseInt(req.params.id)
    const removido = UsuarioModel.deletarUsuario(id)
    
    if (!removido) {
        return res.status(404).json({ mensagem: "Não foi possível remover este usuário!" })
    }
    
    return res.json({ mensagem: "Usuário removido com sucesso!", usuario: removido })
}

module.exports = { listarUsuarios, listarUsuariosId, criarUsuario, editarUsuario, deletarUsuario }