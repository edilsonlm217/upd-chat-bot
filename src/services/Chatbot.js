const bot = require("venom-bot");
const { differenceInMinutes } = require("date-fns");
const { Database } = require("../database/index");
const { InService } = require("../database/schema/InService");

class Chatbot {
  async start() {
    // Conexão com bando de dados
    await Database.connect();

    // Inicialização do Venom-Bot
    this.client = await bot.create();

    return this.client;
  }

  async getStage(message) {
    const { sender } = message;
    const [senderId,] = sender.id.split('@c.us');

    const service = await InService.findOne({ senderId });

    if (service) {
      const { lastMessageReceivedAt } = service;

      if (differenceInMinutes(new Date(), lastMessageReceivedAt) > 15) {
        console.log('[LOG]: Atendimento expirado');
        await service.remove();
      } else {
        console.log('[LOG]: Atendimento encontrado');
        return service.stage;
      }
    }

    console.log('[LOG]: Iniciando novo atendimento');
    // Inicia um novo atendimento
    const newService = await InService.create({
      // TODO: Criar um número de protocolo significativo
      protocolNumber: '12456489712345',
      senderId,
      userName: sender.name,
      lastMessageReceivedAt: new Date(),
    });

    return newService.stage;
  }
}

exports.Chatbot = new Chatbot();