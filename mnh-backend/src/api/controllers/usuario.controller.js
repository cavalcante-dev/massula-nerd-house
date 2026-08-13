const bcrypt = require('bcrypt');
const { Usuario } = require('../models');
const { Op } = require('sequelize');

const TIPOS_VALIDOS = ['admin', 'superadmin'];
const SENHA_MIN = 8;

const mesmoUsuario = (logado, idParam) => Number(idParam) === Number(logado.id);

// CREATE
exports.registrar = async (req, res) => {
  try {
    const { nome, nome_usuario, senha, tipo } = req.body;
    const usuarioLogado = req.usuario;

    if (usuarioLogado.tipo !== 'superadmin') {
      return res.status(403).json({ erro: 'Apenas super administradores podem criar novos usuários.' });
    }

    if (!nome || typeof nome !== 'string' || !nome.trim()) {
      return res.status(400).json({ erro: 'Nome é obrigatório.' });
    }
    if (!senha || typeof senha !== 'string' || senha.length < SENHA_MIN) {
      return res.status(400).json({ erro: `Senha deve ter pelo menos ${SENHA_MIN} caracteres.` });
    }
    if (tipo !== undefined && !TIPOS_VALIDOS.includes(tipo)) {
      return res.status(400).json({ erro: 'Tipo inválido. Use "admin" ou "superadmin".' });
    }

    const nomeUsuario = (nome_usuario && nome_usuario.trim()) || nome.trim();
    const tipoPermitido = tipo === 'superadmin' ? 'superadmin' : 'admin';

    const existente = await Usuario.findOne({ where: { nome_usuario: nomeUsuario } });
    if (existente) return res.status(409).json({ erro: 'Nome de usuário já cadastrado.' });

    const hashed = await bcrypt.hash(senha, 10);
    const usuario = await Usuario.create({
      nome: nome.trim(),
      nome_usuario: nomeUsuario,
      senha_hash: hashed,
      tipo: tipoPermitido,
      ativo: true,
    });

    return res.status(201).json({
      id: usuario.id,
      nome: usuario.nome,
      nome_usuario: usuario.nome_usuario,
      tipo: usuario.tipo,
      ativo: usuario.ativo,
    });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao registrar usuário.', codigo: err.message });
  }
};

// GET (listar todos)
exports.listar = async (req, res) => {
  try {
    if (req.usuario.tipo !== 'superadmin') {
      return res.status(403).json({ erro: 'Acesso negado. Apenas super administradores podem listar usuários.' });
    }

    const where = {};
    if (req.query.ativo === 'true' || req.query.ativo === '1') {
      where.ativo = true;
    } else if (req.query.ativo === 'false' || req.query.ativo === '0') {
      where.ativo = false;
    }

    const usuarios = await Usuario.findAll({
      where,
      attributes: { exclude: ['senha_hash'] },
      order: [['nome', 'ASC']],
    });
    return res.status(200).json(usuarios);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao listar usuários.', codigo: err.message });
  }
};

// GET by ID
exports.obterPorID = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioLogado = req.usuario;

    if (usuarioLogado.tipo !== 'superadmin' && !mesmoUsuario(usuarioLogado, id)) {
      return res.status(403).json({ erro: 'Acesso negado. Você só pode visualizar seu próprio perfil.' });
    }

    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ['senha_hash'] },
    });
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }
    return res.status(200).json(usuario);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao buscar usuário.', codigo: err.message });
  }
};

// UPDATE
exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, nome_usuario, senha, tipo, ativo } = req.body;
    const usuarioLogado = req.usuario;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    if (usuarioLogado.tipo !== 'superadmin' && !mesmoUsuario(usuarioLogado, id)) {
      return res.status(403).json({ erro: 'Acesso negado. Você só pode editar seu próprio perfil.' });
    }

    if (nome !== undefined) {
      if (typeof nome !== 'string' || !nome.trim()) {
        return res.status(400).json({ erro: 'Nome inválido.' });
      }
      usuario.nome = nome;
    }

    if (nome_usuario !== undefined) {
      if (typeof nome_usuario !== 'string' || !nome_usuario.trim()) {
        return res.status(400).json({ erro: 'Nome de usuário inválido.' });
      }
      const nomeExistente = await Usuario.findOne({ where: { nome_usuario, id: { [Op.ne]: id } } });
      if (nomeExistente) {
        return res.status(409).json({ erro: 'Nome de usuário já está em uso.' });
      }
      usuario.nome_usuario = nome_usuario;
    }

    if (senha !== undefined) {
      if (typeof senha !== 'string' || senha.length < SENHA_MIN) {
        return res.status(400).json({ erro: `Senha deve ter pelo menos ${SENHA_MIN} caracteres.` });
      }
      usuario.senha_hash = await bcrypt.hash(senha, 10);
    }

    if (tipo !== undefined) {
      if (usuarioLogado.tipo !== 'superadmin' || mesmoUsuario(usuarioLogado, id)) {
        return res.status(403).json({ erro: 'Apenas super administradores podem alterar o tipo de outros usuários.' });
      }
      if (!TIPOS_VALIDOS.includes(tipo)) {
        return res.status(400).json({ erro: 'Tipo inválido. Use "admin" ou "superadmin".' });
      }
      usuario.tipo = tipo;
    }

    if (ativo !== undefined) {
      if (usuarioLogado.tipo !== 'superadmin') {
        return res.status(403).json({ erro: 'Apenas super administradores podem ativar/desativar usuários.' });
      }
      usuario.ativo = ativo === true || ativo === 'true' || ativo === 1;
    }

    await usuario.save();

    return res.status(200).json({
      sucesso: 'Usuário atualizado com sucesso.',
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        nome_usuario: usuario.nome_usuario,
        tipo: usuario.tipo,
        ativo: usuario.ativo,
      },
    });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao atualizar usuário.', codigo: err.message });
  }
};

// DESATIVAR (soft delete) – apenas super_admin
exports.desativar = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioLogado = req.usuario;

    if (usuarioLogado.tipo !== 'superadmin') {
      return res.status(403).json({ erro: 'Acesso negado. Apenas super administradores podem desativar usuários.' });
    }

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    if (mesmoUsuario(usuarioLogado, id)) {
      return res.status(400).json({ erro: 'Você não pode desativar a si mesmo.' });
    }

    if (!usuario.ativo) {
      return res.status(409).json({ erro: 'Usuário já está desativado.' });
    }

    usuario.ativo = false;
    await usuario.save();
    return res.status(200).json({ sucesso: 'Usuário desativado com sucesso.' });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao desativar usuário.', codigo: err.message });
  }
};

// REATIVAR – apenas super_admin
exports.reativar = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioLogado = req.usuario;

    if (usuarioLogado.tipo !== 'superadmin') {
      return res.status(403).json({ erro: 'Acesso negado. Apenas super administradores podem reativar usuários.' });
    }

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    if (usuario.ativo) {
      return res.status(409).json({ erro: 'Usuário já está ativo.' });
    }

    usuario.ativo = true;
    await usuario.save();
    return res.status(200).json({ sucesso: 'Usuário reativado com sucesso.' });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao reativar usuário.', codigo: err.message });
  }
};
