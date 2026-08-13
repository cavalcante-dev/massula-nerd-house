const express = require('express');
const rateLimit = require('express-rate-limit');

const router = express.Router();
const authController = require('../controllers/auth.controller');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: 'Muitas tentativas de login. Tente novamente em alguns minutos.' },
});

router.post('/login', loginLimiter, authController.login);

module.exports = router;
