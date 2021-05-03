const bot = require('venom-bot');
import { differenceInMinutes } from 'date-fns';
import { switchDatabase } from '../database/tenants';
import fs from 'fs';

import Tenant from '../app/schema/Tenant';
import InService from '../app/schema/InService';

import stages from './stages/index';

export default new function Chatbot() {
  function constructor() { }

  async function listenMessages(sessionName) {
    const client = await bot.create(sessionName, undefined, undefined, {
      logQR: false,
      disableWelcome: true,
      autoClose: 30000,
    });

    client.onMessage(async message => {
      switchDatabase(sessionName);

      if (message.isGroupMsg === false) {
        const stage = await getStage(message);

        try {
          const resp = await stages[stage].obj.execute(message);

          for (let index = 0; index < resp.length; index++) {
            const element = resp[index];
            client.sendText(message.from, element);
          }
        } catch (error) {
          console.log(`[LOG]: ! ${error}`);
        }
      }
    });
  }

  async function getStage(message) {
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
  }

  async function reload() {
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

          await listenMessages(tenant.sessionName);

        });
      }
    });
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