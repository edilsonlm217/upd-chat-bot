import { Router } from 'express';
import MessengerController from './app/controllers/MessengerController';

import WASessionController from './app/controllers/WhatsappSessionController';
import MessengerController from './app/controllers/MessengerController';

const routes = new Router();

routes.post('/session/store', WASessionController.store);
routes.post('/session/update', WASessionController.update);
routes.post('/session/destroy', WASessionController.destroy);

routes.post('/message', MessengerController.store);

export default routes;
