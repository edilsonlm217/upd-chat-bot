const bot = require('venom-bot');
import { differenceInMinutes } from 'date-fns';
import fs from 'fs';

import Tenant from '../app/schema/Tenant';
import InService from '../app/schema/InService';

import stages from './stages/index';

export default new function Chatbot() {
  const middlewares = {};
  const sessions = {};

  function constructor() { }

  function use(funcName, func) {
    middlewares[funcName] = func;
  }

  async function runMiddlewares(sessionName) {
    Object.entries(middlewares).map(middleware => {
      const run = middleware[1];
      run(sessionName);
    });
  }

  async function listenMessages(sessionName) {
    try {
      const client = await bot.create(sessionName, undefined, undefined, {
        logQR: true,
        disableWelcome: true,
        autoClose: 30000,
      });

      sessions[sessionName] = client;

      client.onMessage(async message => {
        if (message.isGroupMsg === false) {
          runMiddlewares(sessionName);
          const stage = await getStage(message, sessionName);

          try {
            const resp = await stages[stage].obj.execute(message);

            for (let index = 0; index < resp.length; index++) {
              const element = resp[index];
              try {
                client.sendText(message.from, element);
              } catch (error) {
                console.log('[LOG]: Failed to send text (whatsapp)');
              }
            }
          } catch (error) {
            console.log(`[LOG][${sessionName}]: Failed to execute reply!`);
            console.log(error);
          }
        }
      });
    } catch (error) {
      console.log('[LOG]: Failed to listen to messages');
    }

  }

  async function getStage(message, sessionName) {
    try {
      const { sender } = message;
      const [senderId,] = sender.id.split('@c.us');

      const service = await InService.findOne({ senderId });

      if (service) {
        const { lastMessageReceivedAt } = service;

        if (differenceInMinutes(new Date(), lastMessageReceivedAt) > 15) {
          console.log('[LOG]: Atendimento expirado');
          service.remove();
        } else {
          console.log('[LOG]: Atendimento encontrado');
          return service.stage;
        }
      }

      console.log('[LOG]: Iniciando novo atendimento');

      // Inicia um novo atendimento
      const newService = await InService.create({
        senderId,
        sessionName,
        lastMessageReceivedAt: new Date(),
      });

      return newService.stage;
    } catch (error) {
      console.log('[LOG]: Failed to get conversation stage');
    }
  }

  async function reload() {
    try {
      fs.readdir('./tokens', (error, files) => {
        if (files) {
          files.map(async file => {
            const [sessionName] = file.split('.data.json');

            const tenant = await Tenant.findOne({
              sessionName,
              isActive: true,
            });

            if (!tenant) {
              return;
            }

            listenMessages(tenant.sessionName);

          });
        }
      });

      console.log('[LOG]: Whatsapp sessions are going to reload');
    } catch (error) {
      console.log('[LOG]: Failed to reload whatsapp sessions');
    }
  }

  const ChatbotPrototype = {
    sessions: sessions,
    middlewares: middlewares,
    init: () => { reload() },
    listenMessages: (sessionName) => { listenMessages(sessionName) },
    use: (funcName, func) => { use(funcName, func) }
  }

  constructor.prototype = ChatbotPrototype;

  let instance = new constructor();
  return instance;
}