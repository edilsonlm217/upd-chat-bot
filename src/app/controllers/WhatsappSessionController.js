const venom = require('venom-bot');

import SessionPool from '../../services/SessionPool';

class WhatsappSessionController {
  async create(req, res) {
    const { sessionName } = req.params;

    try {
      const client = await venom.create(
        sessionName,
        undefined,
        undefined,
        {
          logQR: false,
          disableWelcome: true,
          autoClose: false,
        }
      );

      SessionPool.add(client);
    } catch (error) {
      console.log(error);
    }

    return res.json({ ok: true });
  }
}

export default new WhatsappSessionController();
