import cors from 'cors';
import express, { ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import apiRouter from './routes/api';

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health/', (_request, response) => {
  const connected = mongoose.connection.readyState === 1;
  response.status(connected ? 200 : 503).json({
    status: connected ? 'ok' : 'unavailable',
    database: connected ? 'connected' : 'disconnected',
  });
});

app.use('/api/', apiRouter);

app.use((_request, response) => {
  response.status(404).json({ error: 'Route not found' });
});

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
    response.status(400).json({ error: error.message });
    return;
  }

  if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) {
    response.status(409).json({ error: 'A record with this value already exists' });
    return;
  }

  if (error instanceof SyntaxError && 'body' in error) {
    response.status(400).json({ error: 'Malformed JSON request body' });
    return;
  }

  console.error('Unhandled API error:', error);
  response.status(500).json({ error: 'Internal server error' });
};

app.use(errorHandler);

export default app;
