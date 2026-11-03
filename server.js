require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const openapi = require('./src/docs/openapi');
const autenticar = require('./src/middlewares/autenticar');

const authRoutes = require('./src/routes/auth.routes');
const tarefasRoutes = require('./src/routes/tarefas.routes');
const projetosRoutes = require('./src/routes/projetos.routes');
const usuariosRoutes = require('./src/routes/usuarios.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));


app.use('/auth', authRoutes);

app.use(autenticar);
app.use('/tarefas', tarefasRoutes);
app.use('/projetos', projetosRoutes);
app.use('/usuarios', usuariosRoutes);

app.use((req, res) => {
  res.status(404).json({
    erro: {
      mensagem: 'Rota não encontrada'
    }
  });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ativo na porta ${PORT}`);
  console.log(`Documentação Swagger UI disponível em http://localhost:${PORT}/docs`);
});