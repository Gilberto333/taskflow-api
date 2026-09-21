const jwt = require("jsonwebtoken");
const usuarioModel = require("../models/usuariosModel");

const authController = {
  login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ erro: "Email e senha são obrigatórios" });
      }

      const usuario = usuarioModel.buscarPorEmail(email);

      if (!usuario) {
        return res.status(401).json({ erro: "Credenciais inválidas" });
      }

      if (usuario.senha !== senha) {
        return res.status(401).json({ erro: "Credenciais inválidas" });
      }

      // Evita o erro 500 se o JWT_SECRET não estiver definido na Vercel
      const secret = process.env.JWT_SECRET || "chave_secreta_fallback_taskflow";

      const token = jwt.sign(
        { id: usuario.id, nome: usuario.nome },
        secret,
        { expiresIn: "8h" }
      );

      return res.json({
        token,
        usuario: { id: usuario.id, nome: usuario.nome },
      });
    } catch (erro) {
      console.error("Erro ao realizar login:", erro);
      return res.status(500).json({
        erro: "Erro interno ao processar o login",
        mensagem: erro.message,
      });
    }
  },
};

module.exports = authController;