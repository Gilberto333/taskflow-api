require("dotenv").config();

const express = require("express");
const cors = require("cors");

const logger = require("./src/middlewares/logger");
const validarContentType = require("./src/middlewares/validarContetType");
const temporizador = require("./src/middlewares/temporizador");
const autenticar = require("./src/middlewares/autenticar");

// Certifique-se de que a case (maiúscula/minúscula) bate exatamente com os arquivos da pasta!
const tarefasRoutes = require("./src/routes/tarefas.routes");
const usuariosRoutes = require("./src/routes/usuarios.routes");
const projetosRoutes = require("./src/routes/projetos.routes");
const authRoutes = require("./src/routes/auth.routes");

const app = express();

// 1. Usar PORT em inglês para compatibilidade com a Vercel/Render
const PORT = process.env.PORT || process.env.PORTA || 3000;

// 2. Configuração do CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "https://task-flow-beta-sepia.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  })
);

app.use(express.json());

// Middlewares globais de log e tempo
app.use(logger);
app.use(temporizador);

// 3. Rotas Públicas
app.use("/auth", authRoutes);

// 4. Rotas Protegidas (Exigem Token JWT)
// Se o middleware validarContentType for necessário, aplique apenas em POST/PUT
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