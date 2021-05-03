const venom = require('venom-bot');

import Chatbot from '../../chatbot';

class WhatsappSessionController {
  async create(req, res) {
    const { sessionName } = req.params;

    Chatbot.listenMessages(sessionName);

    return res.json({ ok: true });
  }
}

export default new WhatsappSessionController();
