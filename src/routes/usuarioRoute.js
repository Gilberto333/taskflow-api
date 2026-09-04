const express = require('express')
const router = express.Router()
const usuariosController = require("../controllers/usuariosController")

router.get("/usuarios", usuariosController.listarUsuarios)
router.get("/usuarios/:id", usuariosController.listarUsuariosId)
router.post("/usuarios", usuariosController.criarUsuario)
router.put("/usuarios/:id", usuariosController.editarUsuario)
router.delete("/usuarios/:id", usuariosController.deletarUsuario)

module.exports = router