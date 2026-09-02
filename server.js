const express = require('express')
const app = express()
const PORT = 3000
app.use(express.json())
const rotas = require("./src/routes/usuarioRoute")
app.use(rotas)


app.listen(PORT, () => console.log(`servidor rodando em http://localhost:${PORT}`))