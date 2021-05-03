const bot = require('venom-bot');
import { differenceInMinutes } from 'date-fns';
import ConnectionResolver from '../services/ConnectionResolver';
import fs from 'fs';

import Tenant from '../app/schema/Tenant';
import InService from '../app/schema/InService';

import stages from './stages/index';

export default new function Chatbot() {
  function constructor() { }

  async function listenMessages(sessionName) {
    try {
      const client = await bot.create(sessionName, undefined, undefined, {
        logQR: false,
        disableWelcome: true,
        autoClose: 30000,
      });

      client.onMessage(async message => {
        if (message.isGroupMsg === false) {
          ConnectionResolver.switchDatabase(sessionName);
          const stage = await getStage(message);

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

  async function getStage(message) {
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
        // TODO: Criar um número de protocolo significativo
        protocolNumber: '12456489712345',
        senderId,
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
    init: () => {
      reload();
    },
    listenMessages: (sessionName) => { listenMessages(sessionName) }
  }

  constructor.prototype = ChatbotPrototype;

  let instance = new constructor();
  return instance;
}