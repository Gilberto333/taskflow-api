const projetos = [{ id: 1, descriçao: "taskflow", ativo: true }]
let id = 1

function listarProjetos() {
    return projetos
}

function proximoId() {
    id = id + 1;
    return id;
}

module.exports = { listarProjetos, proximoId }