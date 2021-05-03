import Tenant from '../schema/Tenant';
import Chatbot from '../../chatbot';

class WhatsappSessionController {
  async create(req, res) {
    try {
      const { sessionName } = req.params;

      const tenant = await Tenant.findOne({
        sessionName,
        isActive: true,
      });

      if (!tenant) {
        return;
      }

      // TODO Implementar inicialização do socket.io para envio
      Chatbot.listenMessages(tenant.sessionName);

      return res.json({ ok: true });
    } catch (error) {
      console.log('[LOG]: Failed to create Whatsapp session');
    }
  }
}

export default new WhatsappSessionController();
