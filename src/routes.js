import { Router } from 'express';

import TenantController from './app/controllers/TenantController';

const routes = new Router();

routes.post('/add/tenant', TenantController.create);

export default routes;
