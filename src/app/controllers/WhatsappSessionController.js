const venom = require('venom-bot');
import Chatbot from '../../chatbot/index';

// function start(client) {
//   console.log('start começou a rodar')
//   client.onMessage(async (message) => {
//     try {
//       const result = await client.sendText(message.from, 'Bem-vindo a Updata!');
//       console.log('Result: ', result);
//     } catch (error) {
//       console.error('Error when sending: ', error);
//     }
//   });
//   console.log('start finalizou!')
// }

class WhatsappSessionController {
  async store(req, res) {
    try {
      const client = await venom.create({
        session: 'mk-auth-session', // name of session
        multidevice: false // for version not multidevice use false.(default: true)
      });

      Chatbot.session = {
        ...Chatbot.session,
        'mk-auth-session': client
      }

      console.log(Chatbot.session)
    } catch (error) {
      console.log(error)
    }
    console.log('Iniciando sessão')
    return res.json({ ok: true })
  }

  async update(req, res) {
    console.log('Reiniciando sessão')
    return res.json({ ok: true })
  }

  async destroy(req, res) {
    console.log('Encerrando sessão')
    return res.json({ ok: true })
  }

}

export default new WhatsappSessionController();
