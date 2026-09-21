require("dotenv").config();

const express = require("express");
const cors = require("cors");

const logger = require("./src/middlewares/logger");
const validarContentType = require("./src/middlewares/validarContetType"); // Corrigido erro de digitação
const temporizador = require("./src/middlewares/temporizador");
const autenticar = require("./src/middlewares/autenticar");

const tarefasRoutes = require("./src/routes/tarefas.routes");
const usuariosRoutes = require("./src/routes/usuarios.routes");
const projetosRoutes = require("./src/routes/projetos.routes");
const authRoutes = require("./src/routes/auth.routes");

const app = express();

const PORT = process.env.PORT || process.env.PORTA || 3000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "https://task-flow-beta-sepia.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  })
);

app.use(express.json());

// Middlewares globais
app.use(logger);
app.use(temporizador);

// Rotas Públicas
app.use("/auth", authRoutes);

// Rotas Protegidas (Exigem Token JWT)
app.use("/usuarios", autenticar, usuariosRoutes);
app.use("/tarefas", autenticar, tarefasRoutes);
app.use("/projetos", autenticar, projetosRoutes);

// Tratamento para rotas inexistentes (404)
app.use((req, res) => {
  res.status(404).json({
    erro: "Rota não encontrada",
  });
});


  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));


module.exports = app;