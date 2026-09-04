const projetos = [{ id: 1, descriçao: "taskflow", ativo: true }]
let id = 1

function listarProjetos() {
    return projetos
}

function buscarPorId(idProjeto) {
    return projetos.find(t => t.id === idProjeto)
}

function criarProjeto(dados) {
    id = id + 1;
    const novoProjeto = {
        id: id, 
        descriçao: dados.descriçao, 
        ativo: dados.ativo !== undefined ? dados.ativo : true
    }
    projetos.push(novoProjeto)
    return novoProjeto
}

function editarProjeto(idProjeto, dados) {
    const index = projetos.findIndex(t => t.id === idProjeto);
    if (index === -1) {
        return null;
    }
    
    projetos[index] = {
        id: idProjeto,
        descriçao: dados.descriçao || projetos[index].descriçao,  
        ativo: dados.ativo !== undefined ? dados.ativo : projetos[index].ativo
    };
    
    return projetos[index];
}

function deletarProjeto(idProjeto) {
    const index = projetos.findIndex(t => t.id === idProjeto)
    if (index === -1) {
        return null;
    }
    
    const removido = projetos.splice(index, 1)[0]
    return removido;
}

module.exports = { 
    listarProjetos, 
    buscarPorId, 
    criarProjeto, 
    editarProjeto, 
    deletarProjeto 
}