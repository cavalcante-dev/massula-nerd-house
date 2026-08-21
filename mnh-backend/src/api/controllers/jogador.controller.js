const { Jogador, JogadorPresenca, sequelize } = require('../models');
const { fn, col } = require('sequelize');
const dataHelpers = require('../../helpers/data.helpers');
const jogadorServices = require('../services/jogador.service');

// CREATE
exports.registrar = async (req, res) => {
  try {
    const { nome, instagram, telefone } = req.body;
    const criado_por = req.usuario.id;

    if (!nome || !nome.trim()) {
      return res.status(400).json({ erro: 'Nome do jogador é obrigatório.' });
    }

    const jogador = await Jogador.create({
      nome,
      instagram,
      telefone,
      ativo: true,
      criado_por
    });

    return res.status(201).json({
      id: jogador.id,
      nome: jogador.nome,
      instagram: jogador.instagram,
      telefone: jogador.telefone,
      criado_por: criado_por
    });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao registrar jogador.', codigo: err.message });
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

    const jogadores = await Jogador.findAll({
      where,
      attributes: {
        exclude: ['criado_em', 'atualizado_em'],
        include: [[fn('COUNT', col('presencas.id')), 'total_presencas']],
      },
      include: [{
        model: JogadorPresenca,
        as: 'presencas',
        attributes: [],
      }],
      group: ['Jogador.id'],
      order: [['nome', 'ASC']],
      subQuery: false,
    });

    const resposta = jogadores.map((j) => {
      const obj = j.toJSON();
      obj.total_presencas = Number(obj.total_presencas) || 0;
      obj.patente = jogadorServices.calcularPatente(obj.total_presencas);
      return obj;
    });

    return res.status(200).json(resposta);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao listar jogadores.', codigo: err.message });
  }
};

// GET by ID
exports.obterPorID = async (req, res) => {
  try {
    const { id } = req.params;
    const jogador = await jogadorServices.encontrarJogador(id);

    if (!jogador) {
      return res.status(404).json({ erro: 'Jogador não encontrado.' });
    }

    const totalPresencas = await JogadorPresenca.count({
      where: { id_jogador: id }
    });

    const jogadorJson = jogador.toJSON();
    jogadorJson.total_presencas = totalPresencas;
    jogadorJson.patente_calculada = jogadorServices.calcularPatente(totalPresencas);

    return res.status(200).json(jogadorJson);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao buscar jogador.', codigo: err.message });
  }
};

// UPDATE
exports.atualizar = async (req, res) => {
  try {
    const { nome, instagram, telefone } = req.body;
    const { id } = req.params;
    const atualizado_por = req.usuario.id;
    const jogador = await jogadorServices.encontrarJogador(id);

    if (!jogador) {
      return res.status(404).json({ erro: 'Jogador não encontrado.' });
    }

    if (nome !== undefined) jogador.nome = nome;
    if (instagram !== undefined) jogador.instagram = instagram;
    if (telefone !== undefined) jogador.telefone = telefone;

    jogador.atualizado_por = atualizado_por;
    await jogador.save();

    return res.status(200).json({
      sucesso: 'Jogador atualizado com sucesso.',
      jogador_atualizado: {
        id: jogador.id,
        nome: jogador.nome,
        instagram: jogador.instagram,
        telefone: jogador.telefone,
        ativo: jogador.ativo
      }
    });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao atualizar jogador.', codigo: err.message });
  }
};

// SOFT DELETE
exports.desativar = async (req, res) => {
  try {
    const { id } = req.params;
    const jogador = await jogadorServices.encontrarJogador(id);

    if (!jogador) {
      return res.status(404).json({ erro: 'Jogador não encontrado.' });
    }

    if (jogador.ativo) {
      jogador.ativo = false;
      jogador.atualizado_por = req.usuario.id;
      await jogador.save();
      return res.status(200).json({ sucesso: 'Jogador desativado com sucesso.' });
    } else {
      return res.status(409).json({ sucesso: 'Jogador já está desativado.' });
    }
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao desativar jogador.', codigo: err.message });
  }
};

// REATIVAR
exports.reativar = async (req, res) => {
  try {
    const { id } = req.params;
    const jogador = await jogadorServices.encontrarJogador(id);

    if (!jogador) {
      return res.status(404).json({ erro: 'Jogador não encontrado.' });
    }

    if (!jogador.ativo) {
      jogador.ativo = true;
      jogador.atualizado_por = req.usuario.id;
      await jogador.save();
      return res.status(200).json({ sucesso: 'Jogador reativado com sucesso.' });
    } else {
      return res.status(409).json({ sucesso: 'Jogador já está ativo.' });
    }
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao reativar jogador.', codigo: err.message });
  }
};

// REGISTRAR PRESENÇA
exports.registrarPresenca = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { data } = req.body;
    const criado_por = req.usuario.id;

    if (!dataHelpers.validarData(data)) {
      return res.status(400).json({ erro: 'Data inválida. Use o formato dd/mm/aaaa.' });
    }

    if (dataHelpers.dataEhFutura(data)) {
      return res.status(400).json({ erro: 'Não é possível registrar presença em data futura.' });
    }

    const jogador = await jogadorServices.encontrarJogador(id, t);
    if (!jogador) {
      await t.rollback();
      return res.status(404).json({ erro: 'Jogador não encontrado.' });
    }

    const dataPresenca = dataHelpers.converterParaDate(data);

    const presencaExistente = await JogadorPresenca.findOne({
      where: { id_jogador: id, data_presenca: dataPresenca },
      transaction: t
    });

    if (presencaExistente) {
      await t.rollback();
      return res.status(409).json({ erro: 'Presença já registrada para essa data.' });
    }

    const novaPresenca = await JogadorPresenca.create({
      id_jogador: id,
      data_presenca: dataPresenca,
      criado_por,
    }, { transaction: t });

    const totalPresencas = await JogadorPresenca.count({
      where: { id_jogador: id },
      transaction: t
    });

    await t.commit();

    return res.status(200).json({
      sucesso: 'Presença registrada com sucesso.',
      jogador: {
        id: jogador.id,
        nome: jogador.nome,
        instagram: jogador.instagram,
        telefone: jogador.telefone,
        presencas_total: totalPresencas,
        patente: jogadorServices.calcularPatente(totalPresencas),
        data_presenca: dataHelpers.formatarParaExibicao(novaPresenca.data_presenca)
      }
    });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ erro: 'Erro ao registrar presença.', codigo: err.message });
  }
};
