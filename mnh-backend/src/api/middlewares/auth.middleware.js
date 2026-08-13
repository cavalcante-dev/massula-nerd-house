const { validarAccessToken } = require('../config/jwt');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ erro: 'Token não fornecido.' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ erro: 'Token malformado.' });
  }

  const token = parts[1];
  try {
    const decoded = validarAccessToken(token);
    req.usuario = decoded;
    return next();
  } catch (err) {
    const expirado = err && err.name === 'TokenExpiredError';
    return res.status(401).json({
      erro: expirado ? 'Token expirado.' : 'Token inválido.',
    });
  }
};