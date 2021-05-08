import Chatbot from '../../chatbot';
import { charset, fixAccentuation } from '../../utils';

class MessengerController {
  async store(req, res) {
    const { number, message: msg } = req.body;

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
