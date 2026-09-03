const tarefas = [{ id: 1, titulo: "Estudar MVC", concluida: false }]
let id = 1

function listarTarefas() {
    return tarefas
}

function proximoId() {
    id = id + 1;
    return id;
}

module.exports = { listarTarefas, proximoId }