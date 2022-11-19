import { Router } from 'express';

import MessengerController from './app/controllers/MessengerController';

const routes = new Router();

routes.post('/message', MessengerController.store);

export default routes;
