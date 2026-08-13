module.exports = (req, res, next) => {
  if (!req.usuario || req.usuario.tipo !== 'superadmin') {
    return res.status(403).json({ erro: 'Acesso permitido apenas para super admin.' });
  }
  next();
};
