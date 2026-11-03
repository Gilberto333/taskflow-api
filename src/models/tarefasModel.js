const prisma = require('../database/prisma');

const incluirNomes = {
  projetos: { select: { nome: true } },
  usuarios: { select: { nome: true } },
  prioridades: { select: { descricao: true } },
};

function formatarTarefa(tarefa) {
  if (!tarefa) return null;
  const { projetos, usuarios, prioridades, ...resto } = tarefa;
  return {
    ...resto,
    projeto: projetos?.nome,
    usuario: usuarios?.nome,
    prioridade: prioridades?.descricao,
  };
}

const tarefaModel = {
  listar: async () => {
    const lista = await prisma.tarefas.findMany({
      include: incluirNomes,
      orderBy: { id: 'asc' },
    });
    return lista.map(formatarTarefa);
  },

  buscar: async (id) => {
    const tarefa = await prisma.tarefas.findUnique({
      where: { id: Number(id) },
      include: incluirNomes,
    });
    return tarefa ? formatarTarefa(tarefa) : null;
  },

  adicionar: async (dados) => {
    const tarefa = await prisma.tarefas.create({
      data: {
        texto: dados.texto,
        coluna: dados.coluna || 'afazer',
        ordem: Number(dados.ordem) || 0,
        idprioridade: Number(dados.idprioridade) || 2,
        usuario_id: Number(dados.usuario_id),
        projeto_id: Number(dados.projeto_id),
      },
      include: incluirNomes,
    });
    return formatarTarefa(tarefa);
  },

  atualizar: async (id, dados) => {
    const idNum = Number(id);
    const atual = await prisma.tarefas.findUnique({ where: { id: idNum } });
    if (!atual) return null;

    let iniciadaEm = atual.iniciada_em;
    let concluidaEm = atual.concluida_em;

    if (dados.coluna === 'andamento' && !atual.iniciada_em) {
      iniciadaEm = new Date();
    }
    if (dados.coluna === 'concluida' && !atual.concluida_em) {
      concluidaEm = new Date();
    }

    const tarefa = await prisma.tarefas.update({
      where: { id: idNum },
      data: {
        texto: dados.texto,
        coluna: dados.coluna,
        idprioridade: Number(dados.idprioridade),
        usuario_id: Number(dados.usuario_id),
        projeto_id: Number(dados.projeto_id),
        iniciada_em: iniciadaEm,
        concluida_em: concluidaEm,
      },
      include: incluirNomes,
    });
    return formatarTarefa(tarefa);
  },

  remover: async (id) => {
    try {
      const tarefa = await prisma.tarefas.delete({
        where: { id: Number(id) },
        include: incluirNomes,
      });
      return formatarTarefa(tarefa);
    } catch (erro) {
      if (erro.code === 'P2025') return null;
      throw erro;
    }
  },
};

module.exports = tarefaModel;