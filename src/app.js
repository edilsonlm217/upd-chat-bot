import express from 'express';
import cors from 'cors';
import http from 'http';
import routes from './routes';

import Mongo from './database';
import Chatbot from './chatbot';

import { loadTenantConnections } from './database/tenants';

class App {
  constructor() {
    this.app = express();
    this.server = http.Server(this.app);

    this.middlewares();
    this.routes();
    this.mongo();
    this.tenats();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  routes() {
    this.app.use(routes);
  }

  async mongo() {
    await Mongo.start();
    this.bot();
  }

  bot() {
    Chatbot.init();
  }

  async tenats() {
    await loadTenantConnections();
  }
}

export default new App().server;
