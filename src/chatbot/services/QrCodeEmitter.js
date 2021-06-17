import socketio from 'socket.io';
import Tenant from '../../app/schema/Tenant';

const bot = require('venom-bot');

export default new function QrCodeEmitter() {
  function constructor() { }

  function init(server) {
    const io = socketio(server, {
      cors: { origin: '*' }
    });

    io.on("connection", async socket => {
      const { userId } = socket.handshake.query;

      console.log(`User ${userId} acabou de conectar ao socket`);

      const tenant = await Tenant.findById(userId);

      if (!tenant) {
        return;
      }

      try {
        const client = await bot.create(
          tenant.sessionName,
          base64Qr => {
            socket.emit('read-qr-code', {
              qrcode: base64Qr,
            });
          },
          undefined,
          {
            logQR: false,
            disableWelcome: true,
          }
        );

        const isLogged = await client.isLoggedIn();

        if (isLogged) {
          socket.emit('read-successfully');
          socket.disconnect();
        }

      } catch (error) {
        console.log(error);
      }
    });

    io.on("disconnect", reason => {
      console.log('disconnect');
      if (reason === 'io client disconnect') {
        console.log(`User acabou de desconectar ao socket`);
      }
    });
  }

  const QrCodeEmitterPrototype = {
    init: (server) => { init(server); }
  }

  constructor.prototype = QrCodeEmitterPrototype;

  let instance = new constructor();
  return instance;
}