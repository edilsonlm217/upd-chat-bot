import express from 'express';
import cors from 'cors';
import http from 'http';
import routes from './routes';

import Mongo from './database';
import TenancyDatabase from './chatbot/database';

import Chatbot from './chatbot';
import DatabaseMiddleware from './chatbot/middlewares/database';

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

  async bot() {
    await Chatbot.init();
    await Chatbot.use('DatabaseMiddleware', DatabaseMiddleware);
  }

  async tenats() {
    await TenancyDatabase.start();
  }
}

export default new App().server;
