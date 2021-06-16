const bot = require('venom-bot');
import { differenceInMinutes } from 'date-fns';
import { promisify } from 'util';
import fs from 'fs';

import Tenant from '../app/schema/Tenant';
import Attendance from '../app/schema/Attendance';

import { stages } from './stages/index';

const readDirAsync = promisify(fs.readdir);

export default new function Chatbot() {
  const onlineSessions = {};
  const middlewares = {};

  function constructor() { }

  async function getPreExistingTokens() {
    const tokens = await readDirAsync('./tokens');
    return tokens;
  }

  async function runMiddlewares(tenantCnpj) {
    Object.entries(middlewares).map(middleware => {
      const run = middleware[1];
      run(tenantCnpj);
    });
  }

  function use(funcName, func) {
    middlewares[funcName] = func;
  }

  async function getAttendance(message, tenantCnpj) {
    try {
      const { sender } = message;

      const attendance = await Attendance.findOne({ senderId: sender.id });

      if (attendance) {
        const { lastMessageReceivedAt } = attendance;

        if (differenceInMinutes(new Date(), lastMessageReceivedAt) > 15) {
          console.log('[LOG]: Atendimento expirado');
          attendance.remove();
        } else {
          console.log('[LOG]: Atendimento encontrado');
          return attendance;
        }
      }

      console.log('[LOG]: Iniciando novo atendimento');

      // Inicia um novo atendimento
      const newAttendance = await Attendance.create({
        senderId: sender.id,
        sessionName: tenantCnpj,
        lastMessageReceivedAt: new Date(),
      });

      return newAttendance;
    } catch (error) {
      console.log('[LOG]: Failed to get conversation stage');
    }
  }

  async function initTenantBot(tenantCnpj) {
    /*
      TODO Add comments for describing this method rsposibility
    */

    const session = onlineSessions[tenantCnpj];

    if (session) {
      return {
        error: {
          message: 'This tenant already has an active session',
        }
      };
    }

    const tenant = await Tenant.findOne({
      cnpj: tenantCnpj
    });

    if (!tenant) {
      return {
        error: {
          message: 'Unable to initialize. This tenant is not active.',
        }
      };
    }

    var client = null;

    try {
      client = await bot.create(tenant.cnpj, undefined, undefined, {
        logQR: true,
        disableWelcome: true,
      });

      onlineSessions[tenant.cnpj] = client;

      client.onMessage(async message => {
        await runMiddlewares(tenant.cnpj);

        if (message.from === '559236483445@c.us') {
          const attndnce = await getAttendance(message, tenant.cnpj);
          const response = await stages[attndnce.stage].execute(attndnce, message);

          for (let msg of response) {
            await client.sendText(message.from, msg);
          }
        }
      });

      return {
        success: {
          message: `${tenant.companyName}'s chatbot is online`
        }
      }

    } catch (error) {
      return {
        error: {
          message: `Venom-bot initialization process failed for tenant ${tenant.companyName}. Try again`,
        }
      };
    }
  }

  async function start() {
    /*
      The start() method is responsible
      for initializing the chatbot manager.
      This method should be called only one
      time within application startup.
    */

    const tokens = await getPreExistingTokens();

    if (!tokens) {
      console.log('Não existem tokens');
      return;
    }

    tokens.forEach(async token => {
      const [tokenOwner] = token.split('.data.json');

      const tenant = await Tenant.findOne({
        cnpj: tokenOwner,
      });

      // Tenant existe?
      if (!tenant) {
        console.log('Tenant não existe');
        return;
      }

      // Tenant está ativo
      if (!(tenant.isActive)) {
        console.log('Tenant não está ativo');
        return;
      }

      const response = await initTenantBot(tenant.cnpj);

      if (response?.error) {
        console.log(`[LOG]: ${response.error.message}`);
      }

      if (response?.success) {
        console.log(`[LOG]: ${response.success.message}`);
      }

    });
  }

  const ChatbotPrototype = {
    onlineSessions: onlineSessions,
    middlewares: middlewares,
    init: () => start(),
    runMiddlewares: () => runMiddlewares(),
    use: (funcName, func) => use(funcName, func)
  }

  constructor.prototype = ChatbotPrototype;

  let instance = new constructor();
  return instance;
}