import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import config from './config/config';
import suggestionRoutes from './routes/suggestionRoutes';

const app = express();

mongoose.connect(config.dbUri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(config.apiPrefix, suggestionRoutes);

export default app;
