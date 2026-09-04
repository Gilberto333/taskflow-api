const ProjetoModel = require("../models/projetosModel")

function listarProjetos(req, res) {
    const projetos = ProjetoModel.listarProjetos()
    return res.json(projetos)
}

function listarProjetosId(req, res) {
    const id = parseInt(req.params.id)
    const projeto = ProjetoModel.buscarPorId(id)
    
    if (!projeto) {
        return res.status(404).json({ mensagem: "Projeto não encontrado!" })
    }
    return res.json(projeto)
}

function criarProjeto(req, res) {
    const { descriçao, ativo } = req.body
    const novoProjeto = ProjetoModel.criarProjeto({ descriçao, ativo })
    
    return res.status(200).json(novoProjeto)
}

function editarProjeto(req, res) {
    const id = parseInt(req.params.id);
    const { descriçao, ativo } = req.body;
    
    const projetoAtualizado = ProjetoModel.editarProjeto(id, { descriçao, ativo });

    if (!projetoAtualizado) {
        return res.status(404).json({ erro: "Projeto não encontrado." });
    }
    
    return res.status(200).json(projetoAtualizado);
}

function deletarProjeto(req, res) {
    const id = parseInt(req.params.id)
    const removido = ProjetoModel.deletarProjeto(id)
    
    if (!removido) {
        return res.status(404).json({ mensagem: "Não foi possível remover este projeto!" })
    }
    
    return res.json({ mensagem: "Projeto removido com sucesso!", projeto: removido })
}

module.exports = { listarProjetos, listarProjetosId, criarProjeto, editarProjeto, deletarProjeto }