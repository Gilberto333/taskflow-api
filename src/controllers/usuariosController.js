const ListarUsuariosModel = require("../models/usuariosModel")
const proximoIdModel = require("../models/usuariosModel")

function listarUsuarios(req, res){
    const usuarios = ListarUsuariosModel.listarUsuarios()
    return res.json(usuarios)
}

function listarUsuariosId(req, res){
    const usuarios = ListarUsuariosModel.listarUsuarios()
    const id = parseInt(req.params.id)
    const usuario = usuarios.find(t => t.id === id)
if(!usuario){
    return res.status(404).json({mensagem: "Usuário não encontrado!"})
}
res.json(usuario)
}

function criarUsuario(req, res ){
    const listaUsuarios = ListarUsuariosModel.listarUsuarios()
let id = proximoIdModel.proximoId()
const {nome, email, senha} = req.body

const novoUsuario = {
    id: id, 
    nome: nome, 
    email: email, 
    senha: senha
}

listaUsuarios.push(novoUsuario)
res.status(200).json(novoUsuario)
}

function editarUsuario(req, res) {
    const id = parseInt(req.params.id);
    const { nome, email, senha } = req.body;
    const usuarios = ListarUsuariosModel.listarUsuarios();
    const index = usuarios.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({ erro: "Usuário não encontrado." });
    }
    usuarios[index] = {
        id,
        nome: nome || usuarios[index].nome,  
        email: email || usuarios[index].email,
        senha: senha || usuarios[index].senha
    };
    return res.status(200).json(usuarios[index]);
}

function deletarUsuario (req, res ) {
    const id = parseInt(req.params.id)
    const usuarios = ListarUsuariosModel.listarUsuarios()
    const filtrarUser = usuarios.findIndex(t => t.id === id)
    if(filtrarUser === -1){
        res.status(404).json({mensagem: "Não foi possivel remover este usuário!"})
    }
const removido = usuarios.splice(filtrarUser, 1) [0]
res.json({mensagem:"Usuario removido com sucesso!", tarefa: removido})
}



module.exports = {listarUsuarios, listarUsuariosId, criarUsuario, editarUsuario, deletarUsuario}