import { Router } from 'express';

import TenantController from './app/controllers/TenantController';
import WASessionController from './app/controllers/WhatsappSessionController';
import MessengerController from './app/controllers/MessengerController';

const routes = new Router();

routes.post('/add/tenant', TenantController.create);
routes.get('/:sessionName/scan', WASessionController.create);
routes.post('/whatsapp', MessengerController.store);

export default routes;
