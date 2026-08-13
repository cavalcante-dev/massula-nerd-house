const { Jogo } = require('../models');

const encontrarJogo = async (id) => {
    return await Jogo.findByPk(id);
}

module.exports = {
    encontrarJogo,
}