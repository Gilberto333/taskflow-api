const ProjetoModel = require("../models/projetosModel")

function listarProjetos(req, res) {
    const projetos = ProjetoModel.listarProjetos()
    return res.json(projetos)
}

function listarProjetosId(req, res) {
    const projetos = ProjetoModel.listarProjetos()
    const id = parseInt(req.params.id)
    const projeto = projetos.find(t => t.id === id)
    
    if (!projeto) {
        return res.status(404).json({ mensagem: "Projeto não encontrado!" })
    }
    res.json(projeto)
}

function criarProjeto(req, res) {
    const listaProjetos = ProjetoModel.listarProjetos()
    let id = ProjetoModel.proximoId()
    const { descriçao, ativo } = req.body

    const novoProjeto = {
        id: id, 
        descriçao: descriçao, 
        ativo: ativo !== undefined ? ativo : true
    }

    listaProjetos.push(novoProjeto)
    res.status(200).json(novoProjeto)
}

function editarProjeto(req, res) {
    const id = parseInt(req.params.id);
    const { descriçao, ativo } = req.body;
    const projetos = ProjetoModel.listarProjetos();
    const index = projetos.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({ erro: "Projeto não encontrado." });
    }
    
    projetos[index] = {
        id,
        descriçao: descriçao || projetos[index].descriçao,  
        ativo: ativo !== undefined ? ativo : projetos[index].ativo
    };
    
    return res.status(200).json(projetos[index]);
}

function deletarProjeto(req, res) {
    const id = parseInt(req.params.id)
    const projetos = ProjetoModel.listarProjetos()
    const filtrarProjeto = projetos.findIndex(t => t.id === id)
    
    if (filtrarProjeto === -1) {
        return res.status(404).json({ mensagem: "Não foi possível remover este projeto!" })
    }
    
    const removido = projetos.splice(filtrarProjeto, 1)[0]
    res.json({ mensagem: "Projeto removido com sucesso!", projeto: removido })
}

module.exports = { listarProjetos, listarProjetosId, criarProjeto, editarProjeto, deletarProjeto }