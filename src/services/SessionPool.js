import Tenant from '../app/schema/Tenant';
import InService from '../app/schema/InService';
import { differenceInMinutes } from 'date-fns';
import stages from '../stages/index';
const venom = require('venom-bot');

async function getActiveTenants() {
  const tenants = await Tenant.find({
    isActive: true,
  });

  return tenants;
}

async function getOnGoingService(senderId) {
  const service = await InService.findOne({ senderId });
  return service;
}

async function getStage(message) {
  const { sender } = message;
  const [senderId,] = sender.id.split('@c.us');

  const service = await getOnGoingService(senderId);

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

async function startBot(client) {
  client.onMessage(async message => {
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

class SessionPool {
  constructor() {
    this.sessions = { /* sessionName: session */ };
  }

  add(client) {
    this.sessions[client.session] = client;
  }

  preloadSessions() {
    console.log('[LOG]: Preloading existing sessions');

    getActiveTenants().then((tenants) => {
      tenants.map(tenant => {
        const { sessionName } = tenant;

        venom.create(
          sessionName,
          undefined,
          undefined,
          {
            logQR: false,
            disableWelcome: true,
            autoClose: 30000,
          }
        ).then(
          client => {
            this.sessions[client.session] = client;
            console.log(`[LOG]: ${sessionName}'s session has been preloaded`);
            //
            startBot(client);
          }
        ).catch(error => {
          console.log(`[LOG]: ${error}`);
        });

      });
    });
  }
}

export default new SessionPool();
