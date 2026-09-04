const tarefas = [{usuarioId: 1,  usuario: "Gilberto",titulo: "Estudar MVC", prioridade: "media", coluna: "aFazer" }]
let id = 1

function listarTarefas() {
    return tarefas
}

function buscarPorId(idTarefa) {
    return tarefas.find(t => t.usuarioId === idTarefa)
}

function criarTarefa(dados) {
    id = id + 1;

    const novaTarefa = {
        usuarioId: id,
        usuario: dados.usuario ,
        titulo: dados.titulo, 
        prioridade: dados.prioridade,
        coluna: dados.coluna
    }
    
    tarefas.push(novaTarefa)
    return novaTarefa
  }

function editarTarefa(idTarefa, dados) {
    const index = tarefas.findIndex(t => t.id === idTarefa);
    if (index === -1) {
        return null;
    }
    
    tarefas[index] = {
        id: idTarefa,
        titulo: dados.titulo || tarefas[index].titulo,  
        prioridade: dados.prioridade || tarefas[index].prioridade,
        coluna: dados.coluna || tarefas[index].coluna
    };
    
    return tarefas[index];
}

function deletarTarefa(idTarefa) {
    const index = tarefas.findIndex(t => t.id === idTarefa)
    if (index === -1) {
        return null;
    }
    
    const removido = tarefas.splice(index, 1)[0]
    return removido;
}

module.exports = { 
    listarTarefas, 
    buscarPorId, 
    criarTarefa, 
    editarTarefa, 
    deletarTarefa,
}