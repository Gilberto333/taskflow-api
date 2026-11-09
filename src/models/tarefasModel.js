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
    // Captura os IDs independente se o frontend enviar 'projeto_id' ou 'idprojeto'
    const idPrioridade = Number(dados.idprioridade || dados.prioridade_id || 1);
    const idProjeto = Number(dados.projeto_id || dados.idprojeto || 1); 
    const idUsuario = Number(dados.usuario_id || dados.idusuario || 0);

    const dataPayload = {
      texto: dados.texto,
      coluna: dados.coluna || 'afazer',
      ordem: Number(dados.ordem) || 0,
      // Relação obrigatória de Prioridade
      prioridades: {
        connect: { id: idPrioridade }
      },
      // Relação obrigatória de Projeto
      projetos: {
        connect: { id: idProjeto }
      }
    };

    // Conecta usuário caso tenha sido informado
    if (idUsuario > 0) {
      dataPayload.usuarios = {
        connect: { id: idUsuario }
      };
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

    const idPrioridade = dados.idprioridade || dados.prioridade_id;
    const idProjeto = dados.projeto_id || dados.idprojeto;
    const idUsuario = dados.usuario_id || dados.idusuario;

    if (idPrioridade) {
      dataPayload.prioridades = { connect: { id: Number(idPrioridade) } };
    }
    if (idProjeto) {
      dataPayload.projetos = { connect: { id: Number(idProjeto) } };
    }
    if (idUsuario) {
      dataPayload.usuarios = { connect: { id: Number(idUsuario) } };
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