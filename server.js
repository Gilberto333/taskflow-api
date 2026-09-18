require("dotenv").config();

const logger = require("./src/middlewares/logger");
const validarContentType = require("./src/middlewares/validarContetType");
const temporizador = require("./src/middlewares/temporizador");
const autenticar = require("./src/middlewares/autenticar");

const express = require("express");

const tarefasRoutes = require("./src/routes/tarefas.Routes");
const usuariosRoutes = require("./src/routes/usuarios.Routes");
const projetosRoutes = require("./src/routes/projetos.Routes");
const authRoutes = require("./src/routes/auth.routes");

const app = express();
const cors = require("cors");
const PORTA = process.env.PORTA || 3000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "https://vercel.com/senai-4176/taskflow-api/",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  }),
);

app.use(express.json());
app.use(validarContentType);
app.use(logger);
app.use(temporizador);

app.use("/auth",  authRoutes);
app.use("/usuarios", autenticar, usuariosRoutes);
app.use("/tarefas", autenticar, tarefasRoutes);
app.use("/projetos", autenticar, projetosRoutes);

app.use((req, res) => {
  res.status(404).json({
    erro: "Rota não encontrada",
  });
});

app.listen(PORTA, () => console.log(`Porta ${PORTA}`));