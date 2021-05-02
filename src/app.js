import express from 'express';
import cors from 'cors';
import http from 'http';
import routes from './routes';

import SessionPool from './services/SessionPool';
import Mongo from './database';

class App {
  constructor() {
    this.app = express();
    this.server = http.Server(this.app);

    this.middlewares();
    this.routes();

    // Inicializa conexão com banco de dados
    Mongo.start().then(() => { SessionPool.preloadSessions() });

  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  routes() {
    this.app.use(routes);
  }
}

export default new App().server;
