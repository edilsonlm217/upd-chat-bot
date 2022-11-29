import { Router } from 'express';

import AuthController from './app/controllers/AuthController';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import MessengerController from './app/controllers/MessengerController';

const routes = new Router();

routes.post('/message', MessengerController.store);

routes.get('/session/:sessionName', SessionController.show);

routes.post('/auth', AuthController.index);

routes.post('/user', UserController.store);

export default routes;
