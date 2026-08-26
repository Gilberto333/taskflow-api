const express = require("express");
const app = express();
const PORTA = 3000;

const tarefas = [
  { id: 1, texto: "Estudar Node", prioridade: "alta", coluna: "afazer" },
  { id: 2, texto: "Criar API", prioridade: "alta", coluna: "andamento" },
  { id: 3, texto: "Testar Postman", prioridade: "media", coluna: "concluido" },
];


app.get("/", (req, res) => {
  res.json({api: 'TaskFlow', versao: '1.0', status: 'online'})
})

app.get('/tarefas/:id', (req, res) =>{
  const id = Number(req.params.id)
const tarefa = tarefas.find(t => t.id === id);

if(!tarefa){
  res.status(400).json({Error: "Tarefa não encontrada!"})
}
res.json(tarefa)
})

app.listen(PORTA, () =>{
  console.log(` servidor rodando em http://localhost:${PORTA}`)
})