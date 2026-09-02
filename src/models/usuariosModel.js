const usuarios = [{id: 1, nome: "admin", email: "admin@123gmail.com", senha: "1234"}]
let id = 1
function listarUsuarios(){
    return usuarios
}

function proximoId(){
    id = id + 1;
    return id;
}

module.exports = {listarUsuarios, proximoId}