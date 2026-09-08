const express = require('express')
const app = express()
const PORT = 3000
const logger = require('./src/middlewares/logger');
app.use(logger); 
app.use('/tarefas', tarefasRoutes);
app.use('/usuarios', usuariosRoutes);
app.use(express.json())
const rotas = require("./src/routes/usuarioRoute")
const rotasProjetos = require("./src/routes/projetosRouter")
const rotasTarefas = require("./src/routes/tarefasRoute")
app.use(rotas)
app.use(rotasProjetos)
app.use(rotasTarefas)
app.listen(PORT, () => console.log(`servidor rodando em http://localhost:${PORT}`))