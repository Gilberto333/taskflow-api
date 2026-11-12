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
    const idUsuario = Number(dados.usuario_id || dados.usuarioId || dados.idusuario);

    if (!dados.nome) {
      throw new Error("O campo nome é obrigatório.");
    }
    if (!idUsuario || isNaN(idUsuario)) {
      throw new Error("O campo usuario_id é obrigatório.");
    }

    try {
      return await prisma.projetos.create({
        data: {
          nome: dados.nome,
          descricao: dados.descricao || null,
          usuarios: {
            connect: { id: idUsuario },
          },
        },
        include: {
          usuarios: { select: { nome: true } },
        },
      });
    } catch (erro) {
      if (erro.code === 'P2025') {
        throw new Error("O usuário informado não existe no banco de dados.");
      }
      throw erro;
    }
  },

  atualizar: async (id, dados) => {
    const idNum = Number(id);
    const atual = await prisma.projetos.findUnique({ where: { id: idNum } });
    if (!atual) return null;

    const dataPayload = {
      nome: dados.nome !== undefined ? dados.nome : atual.nome,
      descricao: dados.descricao !== undefined ? dados.descricao : atual.descricao,
    };

    const idUsuario = dados.usuario_id || dados.usuarioId || dados.idusuario;
    if (idUsuario && !isNaN(Number(idUsuario))) {
      dataPayload.usuarios = { connect: { id: Number(idUsuario) } };
    }

    try {
      return await prisma.projetos.update({
        where: { id: idNum },
        data: dataPayload,
        include: {
          usuarios: { select: { nome: true } },
        },
      });
    } catch (erro) {
      if (erro.code === 'P2025') {
        throw new Error("O usuário informado não existe no banco de dados.");
      }
      throw erro;
    }
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