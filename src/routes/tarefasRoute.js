const express = require('express')
const router = express.Router()
const listarTarefasController = require("../controllers/tarefasController")

router.get("/tarefas", listarTarefasController.listarTarefas)
router.get("/tarefas/:id", listarTarefasController.listarTarefasId)
router.post("/tarefas", listarTarefasController.criarTarefa)
router.put("/tarefas/:id", listarTarefasController.editarTarefa)
router.delete("/tarefas/:id", listarTarefasController.deletarTarefa)

module.exports = router