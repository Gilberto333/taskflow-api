const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuariosController");

const validar = require("../middlewares/validar");
const schemas = require("../middlewares/schemas"); // Corrigido 'schemar' para 'schemas'

router.get("/", usuariosController.listar);
router.post("/", validar(schemas.usuario), usuariosController.criar);
router.get("/:id", usuariosController.buscarPorId);
router.put("/:id", validar(schemas.usuario), usuariosController.atualizar);
router.delete("/:id", usuariosController.remover);

module.exports = router;