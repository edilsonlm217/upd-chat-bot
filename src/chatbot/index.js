const bot = require('venom-bot');
import { differenceInMinutes } from 'date-fns';
import fs from 'fs';

import Tenant from '../app/schema/Tenant';
import Attendance from '../app/schema/Attendance';

import { stages } from './stages/index';

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
        await runMiddlewares(sessionName);

        if (message.from === '559236483445@c.us') {
          const attndnce = await getAttendance(message, sessionName);
          const response = await stages[attndnce.stage].execute(attndnce, message);

          for (let msg of response) {
            await client.sendText(message.from, msg);
          }
        }
      });
    } catch (error) {
      console.log('[LOG]: Failed to listen to messages');
    }
  }

  async function getAttendance(message, sessionName) {
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
        sessionName,
        lastMessageReceivedAt: new Date(),
      });

      return newAttendance;
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

            await listenMessages(tenant.sessionName);

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
    listenMessages: async (sessionName) => { await listenMessages(sessionName) },
    use: (funcName, func) => { use(funcName, func) }
  }

  constructor.prototype = ChatbotPrototype;

  let instance = new constructor();
  return instance;
}