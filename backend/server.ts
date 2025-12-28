import http from 'http';
import app from './app';
import config from './config/config';
import { attachAnalyzeSocket } from './websocket/analyzeSocket';
import { logger } from './utils/logger';

const server = http.createServer(app);
attachAnalyzeSocket(server);

server.listen(config.port, () => {
  logger.info({ port: config.port }, 'Server running');
});
