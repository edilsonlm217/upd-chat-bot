import express from 'express';
import cors from 'cors';
import http from 'http';
import routes from './routes';

import Websocket from './services/Websocket';

class App {
  constructor() {
    this.app = express();
    this.server = http.Server(this.app);

    this.middlewares();
    this.routes();
    this.socket();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  routes() {
    this.app.use(routes);
  }

  socket() {
    Websocket.start(this.server);
  }
}

export default new App().server;
