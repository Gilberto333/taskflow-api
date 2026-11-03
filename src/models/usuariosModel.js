const prisma = require('../database/prisma');

const selecaoSegura = {
  id: true,
  nome: true,
  email: true,
  criado_em: true,
};

const usuarioModel = {
  listar: async () => {
    return prisma.usuarios.findMany({
      select: selecaoSegura,
      orderBy: { id: 'asc' },
    });
  },

  buscar: async (id) => {
    const usuario = await prisma.usuarios.findUnique({
      where: { id: Number(id) },
      select: selecaoSegura,
    });
    return usuario || null;
  },

  buscarPorEmail: async (email) => {
    return prisma.usuarios.findUnique({
      where: { email },
    });
  },

  adicionar: async (dados) => {
    return prisma.usuarios.create({
      data: {
        nome: dados.nome,
        email: dados.email,
        senha: dados.senha,
      },
      select: selecaoSegura,
    });
  },

  atualizar: async (id, dados) => {
    const idNum = Number(id);
    const atual = await prisma.usuarios.findUnique({ where: { id: idNum } });
    if (!atual) return null;

    const data = {
      nome: dados.nome,
      email: dados.email,
    };
    if (dados.senha) {
      data.senha = dados.senha;
    }

    return prisma.usuarios.update({
      where: { id: idNum },
      data,
      select: selecaoSegura,
    });
  },

  remover: async (id) => {
    try {
      return await prisma.usuarios.delete({
        where: { id: Number(id) },
        select: selecaoSegura,
      });
    } catch (erro) {
      if (erro.code === 'P2025') return null;
      throw erro;
    }
  },
};

module.exports = usuarioModel;