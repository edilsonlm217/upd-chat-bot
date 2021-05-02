import { Router } from 'express';

import TenantController from './app/controllers/TenantController';
import WASessionController from './app/controllers/WhatsappSessionController';

const routes = new Router();

routes.post('/add/tenant', TenantController.create);
routes.get('/:sessionName/scan', WASessionController.create);

export default routes;
