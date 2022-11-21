import { getSessionByClientAccount } from '../../services/WhatsappAgent';
class MessengerController {
  async store(req, res) {
    const { to, msg, u: user, p: pwd } = req.query;

    const session = getSessionByClientAccount(user);

    if (!session) {
      const error = {
        title: "Bad Request",
        detail: "There is no session owned by this user",
        status: 400,
      };
      console.error(error);
      return res.status(400).json(error);
    }

    session.sendText(to, msg);

    return res.send();

    // const { to: number, msg: message } = req.body;
    // var msg = message;

    // do {
    //   var msg = msg.replace("{linebreak}", "\n");
    // } while (msg.includes("{linebreak}"));

    // var formattedString = msg;

    // for (const item of Object.entries(charset)) {
    //   const key = item[0];
    //   const value = item[1];

    //   do {
    //     formattedString = fixAccentuation(formattedString, key, value);
    //   } while (formattedString.includes(value));
    // }

    // const html = 'http://provedor.updata.com.br/boleto/boleto.hhvm?titulo=92916';

    // try {
    //   await Chatbot.sessions['updata'].sendText(
    //     `${number}@c.us`,
    //     message,
    //   );

    //   await Chatbot.sessions['updata'].sendFile(
    //     `${number}@c.us`,
    //     res.filename
    //   );
    // } catch (error) {
    //   console.log(error);
    //   console.log('[LOG]: Failed @ MessengerController');
    // }

    // request({ uri: html, encoding: null }, (error, response, body) => {
    //   const utf8String = iconv.decode(new Buffer(body), "ISO-8859-1");

    //   pdf.create(utf8String).toFile('./tmp.pdf', async (err, res) => {
    //     try {
    //       await Chatbot.sessions['updata'].sendText(
    //         `${number}@c.us`,
    //         message,
    //       );

    //       await Chatbot.sessions['updata'].sendFile(
    //         `${number}@c.us`,
    //         res.filename
    //       );
    //     } catch (error) {
    //       console.log(error);
    //       console.log('[LOG]: Failed @ MessengerController');
    //     }
    //   });
    // });

    return res.json({ ok: true });
  }
}

export default new MessengerController();
