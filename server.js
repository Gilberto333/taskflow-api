const express = require('express');
const app = express();
const PORT = 3000;

let proximoId = 4
app.use(express.json())

const usuarios = [
  {email: "Admin", senha: "1234"},
{email: 'client', senha : "4321"}]

const listaTarefas= [{id: 1, texto: "Estudar node", prioridade: "Media", coluna: "feito" },
  {id: 2, texto: "Estudar react", prioridade: "alta", coluna: "afazer"},
  {id: 3, texto: "Estudar css", prioridade: "baixa", coluna: "andamento"}
];

app.get("/tarefas", (req, res) => {
  res.json(listaTarefas);
});

app.get("/tarefas/:id", (req, res) => {
  const id = Number(req.params.id);

  const tarefas = listaTarefas.find(t => t.id === id);
  
  res.json(tarefas);
});

app.get("/usuarios", (req, res) => {
  const email = req.query.email

  let usuario = usuarios.filter(t => t.email === email)

  if(!email){
    res.status(400).json({mensagem: "Usuario não encontrado!"})
  }
  res.json(usuario)
})

app.post("/tarefas", (req,res) => {
const {texto, prioridade, coluna} = req.body;

const novaTarefa = {
  id: proximoId++,
  texto: texto,
  prioridade: prioridade || "alta",
  coluna: coluna || "feito"
}

listaTarefas.push(novaTarefa)
res.status(201).json(novaTarefa);
})

app.put("/tarefas/:id", (req, res) =>{
  const id = Number(req.params.id)
  const {texto, prioridade, coluna} = req.body
let indice = listaTarefas.findIndex(t => t.id === id)

if(indice === -1){
 return res.status(400).json({mensagem: "Tarefa não encontrada"})
}

const tarefaAtualizada = {texto, id, prioridade, coluna}
listaTarefas[indice] = tarefaAtualizada

res.json(tarefaAtualizada)
})

app.delete("/tarefas/:id", (req, res) => {
  const id = Number(req.params.id)
  const removerTarefa = listaTarefas.findIndex(t => t.id === id);

  if(removerTarefa === -1){
    return res.status(404).json({mensagem: "Tarefa não encontrada"})
  }
  listaTarefas.splice(removerTarefa, 1)

  res.json(listaTarefas)
})

app.use((req, res) => {
res.status(404).json({

erro: 'Rota não encontrada',
metodo: req.method,
caminho: req.url,
});

});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
})