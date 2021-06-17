import { Router } from 'express';

import WASessionController from './app/controllers/WhatsappSessionController';
import MessengerController from './app/controllers/MessengerController';

import AccountController from './app/controllers/panel/AccountController';
import SessionController from './app/controllers/panel/SessionController';
import ChatbotMessagesController from './app/controllers/panel/ChatbotMessagesController';
import VenomSessionController from './app/controllers/panel/VenomSessionController';

import VenomBotMiddleware from './app/middlewares/venombot';

const routes = new Router();

routes.post('/account', AccountController.store);
routes.post('/session', SessionController.store);
routes.get('/venom/session/:userId', VenomSessionController.show);
routes.post('/venom/session/:userId', VenomBotMiddleware, VenomSessionController.update);

routes.get('/:sessionName/scan/:socketId', WASessionController.create);
routes.post('/whatsapp', MessengerController.store);
routes.get('/messages/:ownerId', ChatbotMessagesController.index);
routes.put('/messages/:ownerId/:msgId', ChatbotMessagesController.update);

export default routes;
