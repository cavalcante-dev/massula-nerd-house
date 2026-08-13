const jwt = require('jsonwebtoken');

const DEFAULT_EXPIRES_IN = '8h';

const gerarAccessToken = (usuarioId, usuarioTipo) => jwt.sign(
  { id: usuarioId, tipo: usuarioTipo },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || DEFAULT_EXPIRES_IN },
);

const validarAccessToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

module.exports = {
  gerarAccessToken,
  validarAccessToken,
};
