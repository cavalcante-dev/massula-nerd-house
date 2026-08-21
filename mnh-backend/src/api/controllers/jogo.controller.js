const { Jogo, Partida } = require('../models');
const jogoServices = require('../services/jogo.service');

// CREATE
exports.registrar = async (req, res) => {
  try {
    const { nome, descricao, config_campos } = req.body;
    const criado_por = req.usuario.id;

    if (!nome || !nome.trim()) {
      return res.status(400).json({ erro: 'Nome do jogo é obrigatório.' });
    }

    const jogo = await Jogo.create({
      nome,
      descricao,
      config_campos: config_campos !== undefined ? config_campos : [],
      ativo: true,
      criado_por,
    });

    return res.status(201).json({
      id: jogo.id,
      nome: jogo.nome,
      descricao: jogo.descricao,
      config_campos: jogo.config_campos,
      ativo: jogo.ativo,
      criado_por: jogo.criado_por,
    });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao registrar jogo.', codigo: err.message });
  }
};

// GET all
exports.listar = async (req, res) => {
  try {
    const where = {};
    if (req.query.ativo === 'true' || req.query.ativo === '1') {
      where.ativo = true;
    } else if (req.query.ativo === 'false' || req.query.ativo === '0') {
      where.ativo = false;
    }

    const jogos = await Jogo.findAll({
      where,
      attributes: { exclude: ['criado_em', 'atualizado_em'] },
      order: [['nome', 'ASC']]
    });

    return res.status(200).json(jogos);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao listar jogos.', codigo: err.message });
  }
};

// GET by ID
exports.obterPorID = async (req, res) => {
  try {
    const { id } = req.params;
    const jogo = await jogoServices.encontrarJogo(id);

    if (!jogo) {
      return res.status(404).json({ erro: 'Jogo não encontrado.' });
    }

    // Opcional: total de partidas associadas
    const totalPartidas = await Partida.count({ where: { id_jogo: id } });

    const jogoJson = jogo.toJSON();
    jogoJson.total_partidas = totalPartidas;

    return res.status(200).json(jogoJson);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao buscar jogo.', codigo: err.message });
  }
};

// UPDATE
exports.atualizar = async (req, res) => {
  try {
    const { nome, descricao, config_campos } = req.body;
    const { id } = req.params;
    const atualizado_por = req.usuario.id;
    const jogo = await jogoServices.encontrarJogo(id);

    if (!jogo) {
      return res.status(404).json({ erro: 'Jogo não encontrado.' });
    }

    if (nome !== undefined) jogo.nome = nome;
    if (descricao !== undefined) jogo.descricao = descricao;
    if (config_campos !== undefined) jogo.config_campos = config_campos;

    jogo.atualizado_por = atualizado_por;
    await jogo.save();

    return res.status(200).json({
      sucesso: 'Jogo atualizado com sucesso.',
      jogo_atualizado: {
        id: jogo.id,
        nome: jogo.nome,
        descricao: jogo.descricao,
        config_campos: jogo.config_campos,
        ativo: jogo.ativo
      }
    });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao atualizar jogo.', codigo: err.message });
  }
};

// SOFT DELETE
exports.desativar = async (req, res) => {
  try {
    const { id } = req.params;
    const jogo = await jogoServices.encontrarJogo(id);

    if (!jogo) {
      return res.status(404).json({ erro: 'Jogo não encontrado.' });
    }

    if (jogo.ativo) {
      jogo.ativo = false;
      jogo.atualizado_por = req.usuario.id;
      await jogo.save();
      return res.status(200).json({ sucesso: 'Jogo desativado com sucesso.' });
    } else {
      return res.status(409).json({ sucesso: 'Jogo já está desativado.' });
    }
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao desativar jogo.', codigo: err.message });
  }
};

// REATIVAR
exports.reativar = async (req, res) => {
  try {
    const { id } = req.params;
    const jogo = await jogoServices.encontrarJogo(id);

    if (!jogo) {
      return res.status(404).json({ erro: 'Jogo não encontrado.' });
    }

    if (!jogo.ativo) {
      jogo.ativo = true;
      jogo.atualizado_por = req.usuario.id;
      await jogo.save();
      return res.status(200).json({ sucesso: 'Jogo reativado com sucesso.' });
    } else {
      return res.status(409).json({ sucesso: 'Jogo já está ativo.' });
    }
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao reativar jogo.', codigo: err.message });
  }
};
