import Message from '../../schema/Message';

class ChatbotMessagesController {
  async index(req, res) {
    const { ownerId } = req.params;

    const messages = await Message.find({
      owner_id: ownerId,
    });

    return res.json(messages);
  }

  async update(req, res) {
    const { ownerId, msgId } = req.params;
    const { newMsg } = req.body;

    const message = await Message.findOne({
      owner_id: ownerId,
      _id: msgId,
    });

    if (!message) {
      return res.status(400).json({ error: 'Unable to find this message' });
    }

    message.message = newMsg;
    await message.save();

    return res.json(message);
  }
}

export default new ChatbotMessagesController();
