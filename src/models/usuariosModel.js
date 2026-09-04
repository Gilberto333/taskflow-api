const usuarios = [{ id: 1, nome: "admin", email: "admin@123gmail.com", senha: "1234" }]
let id = 1

function listarUsuarios() {
    return usuarios
}

function buscarPorId(idUsuario) {
    return usuarios.find(t => t.id === idUsuario)
}

function criarUsuario(dados) {
    id = id + 1;
    const novoUsuario = {
        id: id, 
        nome: dados.nome, 
        email: dados.email, 
        senha: dados.senha
    }
    usuarios.push(novoUsuario)
    return novoUsuario
}

function editarUsuario(idUsuario, dados) {
    const index = usuarios.findIndex(t => t.id === idUsuario);
    if (index === -1) {
        return null;
    }
    
    usuarios[index] = {
        id: idUsuario,
        nome: dados.nome || usuarios[index].nome,  
        email: dados.email || usuarios[index].email,
        senha: dados.senha || usuarios[index].senha
    };
    
    return usuarios[index];
}

function deletarUsuario(idUsuario) {
    const index = usuarios.findIndex(t => t.id === idUsuario)
    if (index === -1) {
        return null;
    }
    
    const removido = usuarios.splice(index, 1)[0]
    return removido;
}

module.exports = { 
    listarUsuarios, 
    buscarPorId, 
    criarUsuario, 
    editarUsuario, 
    deletarUsuario 
}