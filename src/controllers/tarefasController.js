const TarefasModel = require("../models/tarefasModel")

function listarTarefas(req, res) {
    const tarefas = TarefasModel.listarTarefas()
    return res.json(tarefas)
}

function listarTarefasId(req, res) {
    const id = parseInt(req.params.id)
    const tarefa = TarefasModel.buscarPorId(id)
    
    if (!tarefa) {
        return res.status(404).json({ mensagem: "Tarefa não encontrada!" })
    }
    return res.json(tarefa)
}

function criarTarefa(req, res) {
    const { titulo, coluna, prioridade, usuario } = req.body
if(coluna !== "aFazer" && coluna !== "andamento" && coluna !== "feito")
    res.status(400).json({mensagem: "Erro, coluna invalida. Informe apenas aFazer, andamento OU feito "})
if(prioridade !== "media" && prioridade !== "alta" && prioridade !== "baixa")
    res.status(400).json({mensagem: "Erro, prioridade invalida. Informe apenas ALTA, BAIXA OU MEDIA "})
    const novaTarefa = TarefasModel.criarTarefa({ titulo, coluna, prioridade, usuario })
    return res.status(200).json(novaTarefa)
}

function editarTarefa(req, res) {
    const id = parseInt(req.params.id);
    const { titulo, coluna, prioridade } = req.body;
    
    const tarefaAtualizada = TarefasModel.editarTarefa(id, { titulo, coluna, prioridade });

    if (!tarefaAtualizada) {
        return res.status(404).json({ erro: "Tarefa não encontrada." });
    }
    
    return res.status(200).json(tarefaAtualizada);
}

function deletarTarefa(req, res) {
    const id = parseInt(req.params.id)
    const removido = TarefasModel.deletarTarefa(id)
    
    if (!removido) {
        return res.status(404).json({ mensagem: "Não foi possível remover esta tarefa!" })
    }
    
    return res.json({ mensagem: "Tarefa removida com sucesso!", tarefa: removido })
}

module.exports = { listarTarefas, listarTarefasId, criarTarefa, editarTarefa, deletarTarefa }