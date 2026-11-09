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
    const idPrioridade = Number(dados.prioridade_id || dados.idprioridade);
    const idProjeto = Number(dados.projeto_id || dados.idprojeto);
    const idUsuario = Number(dados.usuario_id || dados.idusuario);

    if (!idProjeto || isNaN(idProjeto)) {
      throw new Error("O campo projeto_id (ou idprojeto) é obrigatório.");
    }
    if (!idUsuario || isNaN(idUsuario)) {
      throw new Error("O campo usuario_id (ou idusuario) é obrigatório.");
    }
    if (!idPrioridade || isNaN(idPrioridade)) {
      throw new Error("O campo prioridade_id (ou idprioridade) é obrigatório.");
    }

    const dataPayload = {
      texto: dados.texto,
      coluna: dados.coluna || 'afazer',
      ordem: Number(dados.ordem) || 0,
      prioridades: {
        connect: { id: idPrioridade }
      },
      projetos: {
        connect: { id: idProjeto }
      },
      usuarios: {
        connect: { id: idUsuario }
      }
    };

    try {
      const tarefa = await prisma.tarefas.create({
        data: dataPayload,
        include: incluirNomes,
      });
      return formatarTarefa(tarefa);
    } catch (erro) {
      if (erro.code === 'P2025') {
        throw new Error("O projeto, usuário ou prioridade informado não existe no banco de dados.");
      }
      throw erro;
    }
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

    const idPrioridade = dados.prioridade_id || dados.idprioridade;
    const idProjeto = dados.projeto_id || dados.idprojeto;
    const idUsuario = dados.usuario_id || dados.idusuario;

    if (idPrioridade && !isNaN(Number(idPrioridade))) {
      dataPayload.prioridades = { connect: { id: Number(idPrioridade) } };
    }
    if (idProjeto && !isNaN(Number(idProjeto))) {
      dataPayload.projetos = { connect: { id: Number(idProjeto) } };
    }
    if (idUsuario && !isNaN(Number(idUsuario))) {
      dataPayload.usuarios = { connect: { id: Number(idUsuario) } };
    }

    try {
      const tarefa = await prisma.tarefas.update({
        where: { id: idNum },
        data: dataPayload,
        include: incluirNomes,
      });
      return formatarTarefa(tarefa);
    } catch (erro) {
      if (erro.code === 'P2025') {
        throw new Error("O relacionamento informado (projeto, usuário ou prioridade) não existe.");
      }
      throw erro;
    }
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

  contarPorUsuario: async (idUsuario) => {
    const idNum = Number(idUsuario);
    if (!idNum || isNaN(idNum)) return 0;
    return await prisma.tarefas.count({
      where: {
        usuarios: { id: idNum }
      }
    });
  }
};

module.exports = tarefaModel;