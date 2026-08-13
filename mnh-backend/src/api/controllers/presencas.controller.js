const presencasService = require('../services/presenca.service');
const dataHelpers = require('../../helpers/data.helpers');
const jogadorService = require('../services/jogador.service');
const { sequelize } = require('../models');


exports.registrarPresenca = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id_jogador } = req.params;
    const { data } = req.body;

    if (!dataHelpers.validarData(data)) {
      await t.rollback();
      return res.status(400).json({ erro: 'Data inválida. Use o formato dd/mm/aaaa.' });
    }
    if (dataHelpers.dataEhFutura(data)) {
      await t.rollback();
      return res.status(400).json({ erro: 'Não pode registrar data futura.' });
    }

    const dataPresenca = dataHelpers.converterParaDate(data);

    const jogador = await jogadorService.encontrarJogador(id_jogador);
    if (!jogador) {
      await t.rollback();
      return res.status(404).json({ erro: 'Jogador não encontrado.' });
    }

    const jaExiste = await presencasService.verificarPresencaNaData(id_jogador, dataPresenca);
    if (jaExiste) {
      await t.rollback();
      return res.status(409).json({ erro: 'Presença já registrada nessa data.' });
    }

    const presenca = await presencasService.registrarNovaPresenca(id_jogador, dataPresenca, t);

    const totalPresencas = await presencasService.contarPresencasPorJogador(id_jogador);

    await t.commit();
    return res.status(201).json({
      sucesso: true,
      presenca,
      jogador: {
        id: jogador.id,
        nome: jogador.nome,
        patente: jogadorService.calcularPatente(totalPresencas),
      },
    });
  } catch (err) {
    await t.rollback();
    return res.status(500).json({ erro: 'Erro ao registrar presença.', codigo: err.message });
  }
};

const parseData = (valor) => {
  if (!valor) return null;
  if (dataHelpers.validarData(valor)) return dataHelpers.converterParaDate(valor);
  const d = new Date(valor);
  return Number.isNaN(d.getTime()) ? null : d;
};

exports.listarPresencas = async (req, res) => {
  try {
    const { inicio, fim } = req.query;
    const dataInicio = parseData(inicio) || new Date('1970-01-01');
    const dataFim = parseData(fim) || new Date();
    if ((inicio && !parseData(inicio)) || (fim && !parseData(fim))) {
      return res.status(400).json({ erro: 'Datas de início ou fim inválidas.' });
    }
    const presencas = await presencasService.listarPresencasPorPeriodo(dataInicio, dataFim);
    return res.json(presencas);
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao listar presenças.', codigo: err.message });
  }
};
