const express = require('express')
const router = express.Router()
const projetoController = require("../controllers/projetosController")

router.get("/projetos", projetoController.listarProjetos)
router.get("/projetos/:id", projetoController.listarProjetosId)
router.post("/projetos", projetoController.criarProjeto)
router.put("/projetos/:id", projetoController.editarProjeto)
router.delete("/projetos/:id", projetoController.deletarProjeto)

module.exports = router