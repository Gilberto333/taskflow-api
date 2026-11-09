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
    const idPrioridade = Number(dados.idprioridade || dados.prioridade_id || 1);
    const idProjeto = Number(dados.projeto_id || dados.idprojeto || 1); 
    const idUsuario = Number(dados.usuario_id || dados.idusuario);

    // Validação para evitar disparar o erro do Prisma caso o ID venha ausente/inválido
    if (!idUsuario || isNaN(idUsuario)) {
      throw new Error("O campo usuario_id (ou idusuario) é obrigatório para criar a tarefa.");
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
      // Conexão obrigatória com a relação de usuário
      usuarios: {
        connect: { id: idUsuario }
      }
    };

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

    if (idPrioridade && !isNaN(Number(idPrioridade))) {
      dataPayload.prioridades = { connect: { id: Number(idPrioridade) } };
    }
    if (idProjeto && !isNaN(Number(idProjeto))) {
      dataPayload.projetos = { connect: { id: Number(idProjeto) } };
    }
    if (idUsuario && !isNaN(Number(idUsuario))) {
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

  // Método adicionado para atender a chamada feita no usuariosController.js ao remover usuário
  contarPorUsuario: async (idUsuario) => {
    return await prisma.tarefas.count({
      where: {
        usuarios: { id: Number(idUsuario) }
      }
    });
  }
};

module.exports = tarefaModel;