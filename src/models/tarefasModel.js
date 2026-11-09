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
    const idPrioridade = dados.idprioridade ? Number(dados.idprioridade) : 1;
    const usuarioId = dados.usuario_id ? Number(dados.usuario_id) : undefined;
    const projetoId = dados.projeto_id ? Number(dados.projeto_id) : undefined;

    const dataPayload = {
      texto: dados.texto,
      coluna: dados.coluna || 'afazer',
      ordem: Number(dados.ordem) || 0,
      // Conecta o relacionamento com a tabela prioridades
      prioridades: {
        connect: { id: idPrioridade }
      }
    };

    // Conecta as relações de usuário e projeto apenas se os IDs forem fornecidos
    if (usuarioId) {
      dataPayload.usuarios = { connect: { id: usuarioId } };
    }
    if (projetoId) {
      dataPayload.projetos = { connect: { id: projetoId } };
    }

    const tarefa = await prisma.tarefas.create({
      data: dataPayload,
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

    const dataPayload = {
      texto: dados.texto !== undefined ? dados.texto : atual.texto,
      coluna: dados.coluna !== undefined ? dados.coluna : atual.coluna,
      iniciada_em: iniciadaEm,
      concluida_em: concluidaEm,
    };

    if (dados.idprioridade) {
      dataPayload.prioridades = { connect: { id: Number(dados.idprioridade) } };
    }
    if (dados.usuario_id) {
      dataPayload.usuarios = { connect: { id: Number(dados.usuario_id) } };
    }
    if (dados.projeto_id) {
      dataPayload.projetos = { connect: { id: Number(dados.projeto_id) } };
    }

    const tarefa = await prisma.tarefas.update({
      where: { id: idNum },
      data: dataPayload,
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