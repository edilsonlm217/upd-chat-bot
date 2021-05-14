import Chatbot from '../../chatbot';
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

    Chatbot.sessions['updata'].sendText(
      `${number}@c.us`,
      formattedString
    );

    res.json({
      message: formattedString,
    });
  }
}

export default new MessengerController();
