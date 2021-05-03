import Tenant from '../schema/Tenant';
import Chatbot from '../../chatbot';

class WhatsappSessionController {
  async create(req, res) {
    const { sessionName } = req.params;

    const tenant = await Tenant.findOne({
      sessionName,
      isActive: true,
    });

    if (!tenant) {
      return;
    }
    
    Chatbot.listenMessages(tenant.sessionName);

    return res.json({ ok: true });
  }
}

export default new WhatsappSessionController();
