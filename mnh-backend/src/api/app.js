const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
  : null;

const corsOptions = corsOrigins && corsOrigins.length
  ? { origin: corsOrigins }
  : {};

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

const routes = require('./routes');

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.error('Erro não tratado:', err);
  const status = err.status || 500;
  res.status(status).json({
    erro: err.publicMessage || 'Erro interno do servidor.',
  });
});

module.exports = app;
