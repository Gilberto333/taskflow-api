const prisma = require('../database/prisma');

const projetoModel = {
  listar: async () => {
    return prisma.projetos.findMany({
      include: {
        usuarios: { select: { nome: true } },
      },
      orderBy: { nome: 'asc' },
    });
  },

  buscar: async (id) => {
    const projeto = await prisma.projetos.findUnique({
      where: { id: Number(id) },
      include: {
        usuarios: { select: { nome: true } },
      },
    });
    return projeto || null;
  },

  adicionar: async (dados) => {
    return prisma.projetos.create({
      data: {
        nome: dados.nome,
        descricao: dados.descricao,
        usuario_id: Number(dados.usuario_id),
      },
    });
  },

  atualizar: async (id, dados) => {
    const idNum = Number(id);
    const atual = await prisma.projetos.findUnique({ where: { id: idNum } });
    if (!atual) return null;

    return prisma.projetos.update({
      where: { id: idNum },
      data: {
        nome: dados.nome,
        descricao: dados.descricao,
        usuario_id: Number(dados.usuario_id),
      },
    });
  },

  remover: async (id) => {
    try {
      return await prisma.projetos.delete({
        where: { id: Number(id) },
      });
    } catch (erro) {
      if (erro.code === 'P2025') return null;
      throw erro;
    }
  },
};

module.exports = projetoModel;