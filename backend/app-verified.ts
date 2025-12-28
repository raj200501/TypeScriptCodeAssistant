import express from 'express';
import bodyParser from 'body-parser';
import config from './config/config';
import suggestionRoutes from './routes/suggestionRoutes';
import snippetRoutes from './routes/snippetRoutes';

const app = express();

app.use(bodyParser.json());
app.use(config.apiPrefix, suggestionRoutes);
app.use(config.apiPrefix, snippetRoutes);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default app;
