const express = require("express");
const app = express();
const PORTA = 3000;

const tarefas = [
  { id: 1, texto: "Estudar Node", prioridade: "alta", coluna: "afazer" },
  { id: 2, texto: "Criar API", prioridade: "alta", coluna: "andamento" },
  { id: 3, texto: "Testar Postman", prioridade: "media", coluna: "concluido" },
];

app.get("/", (req, res) => {
  res.json({ api: "TaskFlow", versao: "1.0", status: "online" });
});

app.get("/tarefas", (req, res) => {
  const { coluna, prioridade } = req.query;

  let resultado = tarefas;

  if (coluna) {
    resultado = resultado.filter((t) => t.coluna === coluna);
  }

  if (prioridade) {
    resultado = resultado.filter((t) => t.prioridade === prioridade);
  }

  res.json(resultado);
});

app.listen(PORTA, () => {
  console.log(` servidor rodando em http://localhost:${PORTA}`);
});
