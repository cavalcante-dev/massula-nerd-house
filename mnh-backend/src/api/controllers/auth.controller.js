const bcrypt = require('bcrypt');
const { Usuario } = require('../models');
const { gerarAccessToken } = require('../config/jwt');

exports.login = async (req, res) => {
  try {
    const { nome, senha } = req.body;

    if (!nome || !senha) {
      return res.status(400).json({ erro: 'Nome de usuário e senha são obrigatórios.' });
    }

    const usuario = await Usuario.findOne({ where: { nome_usuario: nome } });

    if (!usuario) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    if (!usuario.ativo) {
      return res.status(401).json({ erro: 'Usuário desativado. Contate um administrador.' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    const accessToken = gerarAccessToken(usuario.id, usuario.tipo);

    return res.status(200).json({
      accessToken,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        nome_usuario: usuario.nome_usuario,
        tipo: usuario.tipo,
      },
    });
  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ erro: 'Erro interno ao realizar login.' });
  }
};
