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
    this.bot();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  routes() {
    this.app.use(routes);
  }

  mongo() {
    Mongo.start();
  }

  bot() {
    Chatbot.init();
  }

  tenats() {
    loadTenantConnections();
  }
}

export default new App().server;
