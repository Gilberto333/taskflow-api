const express = require("express");
const router = express.Router();

// 1. Corrigido para minúscula (evita erro de módulo não encontrado no Linux/Vercel)
const tarefasController = require("../controllers/tarefas.controller");

const validar = require("../middlewares/validar");
const schemas = require("../middlewares/schemar"); // Verifique se o nome do arquivo no disco é 'schemar.js' ou 'schema.js'

router.get("/estatisticas", tarefasController.estatisticas);
router.get("/", tarefasController.listar);

// 2. Removido 'validar' do GET /:id (GET não possui body)
router.get("/:id", tarefasController.buscarPorId);

// 3. Adicionado 'validar' no POST e PUT (onde realmente existe envio de dados)
router.post("/", validar(schemas.tarefa), tarefasController.criar);
router.put("/:id", validar(schemas.tarefa), tarefasController.atualizar);

router.delete("/:id", tarefasController.remover);

module.exports = router;