import Tenant from '../schema/Tenant';
import Chatbot from '../../chatbot';
import Websocket from '../../services/websocket';

const bot = require('venom-bot');

class WhatsappSessionController {
  async create(req, res) {
    const { sessionName, socketId } = req.params;

    const socket = Websocket.connections[socketId];

    try {
      const tenant = await Tenant.findOne({
        sessionName,
        isActive: true,
      });

      if (!tenant) {
        return;
      }

      const client = await bot.create(
        sessionName,
        (base64Qr, asciiQR, attempts, urlCode) => {
          socket.emit('qrcode', {
            qrcode: base64Qr,
          });
        },
        undefined,
        {
          logQR: false,
          disableWelcome: true,
          autoClose: 30000,
        }
      );

      Chatbot.sessions[sessionName] = client;

      client.onMessage(async message => {
        await Chatbot.runMiddlewares(sessionName);

        if (message.from === '559236483445@c.us') {
          const attndnce = await getAttendance(message, sessionName);
          const response = await stages[attndnce.stage].execute(attndnce, message);

          for (let msg of response) {
            await client.sendText(message.from, msg);
          }
        }
      });

      return res.json({ ok: true });
    } catch (error) {
      console.log(error);
      console.log('[LOG]: Failed to create Whatsapp session');
    }
  }
}

export default new WhatsappSessionController();
