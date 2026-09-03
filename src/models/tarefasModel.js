const tarefas = [{ id: 1, titulo: "Estudar MVC", prioridade: "media", coluna: "aFazer" }]
let id = 1

function listarTarefas() {
    return tarefas
}

function proximoId() {
    id = id + 1;
    return id;
}

module.exports = { listarTarefas, proximoId }