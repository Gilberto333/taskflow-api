const express = require('express')
const router = express.Router()


const listarUsuariosController = require("../controllers/usuariosController")

router.get("/usuarios", listarUsuariosController.listarUsuarios)
router.get("/usuarios/:id", listarUsuariosController.listarUsuariosId)
router.post( "/usuarios", listarUsuariosController.criarUsuario)
router.put("/usuarios/:id", listarUsuariosController.editarUsuario)
router.delete("/usuarios/:id", listarUsuariosController.deletarUsuario)






module.exports = router