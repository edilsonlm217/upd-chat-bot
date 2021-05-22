import Chatbot from '../../chatbot';
import pdf from 'html-pdf';
// import Buffer from 'buffer';
import iconv from 'iconv-lite';
import request from 'request';
import { charset, fixAccentuation } from '../../utils';

class MessengerController {
  async store(req, res) {
    const { number, message } = req.body;

    var msg = message;

    do {
      var msg = msg.replace("{linebreak}", "\n");
    } while (msg.includes("{linebreak}"));

    var formattedString = msg;

    for (const item of Object.entries(charset)) {
      const key = item[0];
      const value = item[1];

      do {
        formattedString = fixAccentuation(formattedString, key, value);
      } while (formattedString.includes(value));
    }

    const html = 'http://provedor.updata.com.br/boleto/20boleto.php?titulo=70559';

    request({ uri: html, encoding: null }, (error, response, body) => {
      const utf8String = iconv.decode(new Buffer(body), "ISO-8859-1");
      console.log(utf8String);
      pdf.create(utf8String).toFile('./tmp.pdf', async (err, res) => {
        console.log(res.filename);

        try {
          await Chatbot.sessions['updata'].sendText(
            `${number}@c.us`,
            message,
          );

          await Chatbot.sessions['updata'].sendFile(
            `${number}@c.us`,
            res.filename
          );
        } catch (error) {
          console.log(error);
        }
      });
    });

    return res.json({ ok: true });

    res.json({
      message: formattedString,
    });
  }
}

export default new MessengerController();
