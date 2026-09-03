const TarefasModel = require("../models/tarefasModel")

function listarTarefas(req, res) {
    const tarefas = TarefasModel.listarTarefas()
    return res.json(tarefas)
}

function listarTarefasId(req, res) {
    const tarefas = TarefasModel.listarTarefas()
    const id = parseInt(req.params.id)
    const tarefa = tarefas.find(t => t.id === id)
    
    if (!tarefa) {
        return res.status(404).json({ mensagem: "Tarefa não encontrada!" })
    }
    res.json(tarefa)
}

function criarTarefa(req, res) {
    const listaTarefas = TarefasModel.listarTarefas()
    let id = TarefasModel.proximoId()
    const { titulo, concluida } = req.body

    const novaTarefa = {
        id: id, 
        titulo: titulo, 
        concluida: concluida !== undefined ? concluida : false
    }

    listaTarefas.push(novaTarefa)
    res.status(200).json(novaTarefa)
}

function editarTarefa(req, res) {
    const id = parseInt(req.params.id);
    const { titulo, concluida } = req.body;
    const tarefas = TarefasModel.listarTarefas();
    const index = tarefas.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({ erro: "Tarefa não encontrada." });
    }
    
    tarefas[index] = {
        id,
        titulo: titulo || tarefas[index].titulo,  
        concluida: concluida !== undefined ? concluida : tarefas[index].concluida
    };
    
    return res.status(200).json(tarefas[index]);
}

function deletarTarefa(req, res) {
    const id = parseInt(req.params.id)
    const tarefas = TarefasModel.listarTarefas()
    const filtrarTarefa = tarefas.findIndex(t => t.id === id)
    
    if (filtrarTarefa === -1) {
        return res.status(404).json({ mensagem: "Não foi possível remover esta tarefa!" })
    }
    
    const removido = tarefas.splice(filtrarTarefa, 1)[0]
    res.json({ mensagem: "Tarefa removida com sucesso!", tarefa: removido })
}

module.exports = { listarTarefas, listarTarefasId, criarTarefa, editarTarefa, deletarTarefa }