const partidaJogadoresService = require('../services/partidaJogadores.service');
const jogadorService = require('../services/jogador.service');
const partidaService = require('../services/partidas.service');
const jogadorNivelService = require('../services/jogadorNivel.service');

exports.adicionarJogadorNaPartida = async (req, res) => {
  try {
    const { id_partida, id_jogador } = req.params;
    const { posicao_final } = req.body;

    if (posicao_final !== undefined && posicao_final !== null) {
      if (!Number.isInteger(Number(posicao_final)) || Number(posicao_final) < 1) {
        return res.status(400).json({ erro: 'posicao_final deve ser inteiro >= 1.' });
      }
    }

    const partida = await partidaService.encontrarPartida(id_partida);
    if (!partida) return res.status(404).json({ erro: 'Partida não encontrada.' });

    const jogador = await jogadorService.encontrarJogador(id_jogador);
    if (!jogador) return res.status(404).json({ erro: 'Jogador não encontrado.' });

    const nivelRegistro = await jogadorNivelService.encontrarNivel(id_jogador, partida.id_jogo);
    if (!nivelRegistro) {
      return res.status(400).json({
        erro: `Jogador ${id_jogador} não possui nível cadastrado para o jogo ${partida.id_jogo}. Cadastre o nível em PUT /api/jogador-nivel/jogador/${id_jogador}/jogo/${partida.id_jogo} antes de adicioná-lo à partida.`,
      });
    }

    const participante = await partidaJogadoresService.adicionarParticipante(
      id_partida,
      id_jogador,
      { posicao_final },
    );
    return res.status(201).json(participante);
  } catch (err) {
    if (err.message === 'Jogador já está na partida') {
      return res.status(409).json({ erro: err.message });
    }
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ erro: 'Jogador já registrado nessa partida.' });
    }
    return res.status(500).json({ erro: 'Erro ao adicionar jogador à partida.', codigo: err.message });
  }
};

exports.listarParticipantes = async (req, res) => {
  try {
    const { id_partida } = req.params;
    const participantes = await partidaJogadoresService.listarParticipantesDaPartida(id_partida);
    return res.json(participantes);
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
};

exports.atualizarParticipante = async (req, res) => {
  try {
    const { id_partida, id_jogador } = req.params;
    const dados = req.body;
    const participante = await partidaJogadoresService.atualizarParticipante(id_partida, id_jogador, dados);
    return res.json({ sucesso: true, participante });
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
};

exports.removerParticipante = async (req, res) => {
  try {
    const { id_partida, id_jogador } = req.params;
    await partidaJogadoresService.removerParticipante(id_partida, id_jogador);
    return res.json({ sucesso: true });
  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
};
