const express = require('express');
const app = express();
const PORT = 3000;
app.use(express.json());

const listaUsuarios = [{id: 1, nome: 'Gilberto', email: "admin123@gmail.com", senha: "1234"}];
let idUsuario = 2;
const listaTarefas = [{id: 1, texto: "Fazer frontend", prioridade: "alta", coluna: "andamento"}];
let idTarefa = 2;



app.get('/tarefas', (req, res) => {
  res.status(200).json(listaTarefas);
});

app.get("/tarefas/:id", (req, res) => {
  const id = Number(req.params.id);
  const tarefaReq = listaTarefas.find(t => t.id === id);

  if (!tarefaReq) {
    return res.status(404).json({ mensagem: "Tarefa não encontrada" });
  }
  res.status(200).json(tarefaReq);
});

app.post("/tarefas", (req, res) => {
  const { texto, prioridade, coluna } = req.body;
  const novaTarefa = {
    id: idTarefa++,
    texto,
    prioridade,
    coluna
  };

  listaTarefas.push(novaTarefa);
  res.status(201).json({ mensagem: 'A tarefa foi criada com sucesso!', novaTarefa });
});

app.put("/tarefas/:id", (req, res) => {
  const id = Number(req.params.id);
  const { texto, prioridade, coluna } = req.body;
  const index = listaTarefas.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ mensagem: "Não foi possível atualizar esta tarefa, verifique se ela é existente" });
  }

  listaTarefas[index] = { id, texto, prioridade, coluna };
  res.status(200).json(listaTarefas[index]);
});

app.delete("/tarefas/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = listaTarefas.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ mensagem: "Não foi possível deletar: Tarefa não existente" });
  }

  const [tarefaDeletada] = listaTarefas.splice(index, 1);
  res.status(200).json({ mensagem: "Tarefa deletada com sucesso!", tarefaDeletada });
});



app.get('/usuarios', (req, res) => {
  res.status(200).json(listaUsuarios);
});

app.get("/usuarios/:id", (req, res) => {
  const id = Number(req.params.id);
  const usuarioReq = listaUsuarios.find(u => u.id === id);

  if (!usuarioReq) {
    return res.status(404).json({ mensagem: "Usuário não encontrado" });
  }
  res.status(200).json(usuarioReq);
});

app.post("/usuarios", (req, res) => {
  const { nome, email, senha } = req.body;
  const novoUsuario = {
    id: idUsuario++,
    nome,
    email,
    senha
  };

  listaUsuarios.push(novoUsuario);
  res.status(201).json({ mensagem: 'O usuário foi criado com sucesso!', novoUsuario });
});

app.put("/usuarios/:id", (req, res) => {
  const id = Number(req.params.id);
  const { nome, email, senha } = req.body;
  const index = listaUsuarios.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).json({ mensagem: "Não foi possível atualizar este usuário, verifique se é existente" });
  }

  listaUsuarios[index] = { id, nome, email, senha };
  res.status(200).json(listaUsuarios[index]);
});

app.delete("/usuarios/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = listaUsuarios.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).json({ mensagem: "Não foi possível deletar: Usuário não existente" });
  }

  const [usuarioDeletado] = listaUsuarios.splice(index, 1);
  res.status(200).json({ mensagem: "Usuário deletado com sucesso!", usuarioDeletado });
});

app.use((req, res) => {
res.status(404).json({
erro: 'Rota não encontrada',
metodo: req.method,
caminho: req.url,
});
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));