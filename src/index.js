const { Chatbot } = require("./services/Chatbot");
const { stages } = require("./stages/index");

async function ChatbotServiceStart() {
  const client = await Chatbot.start();

  client.onMessage(async message => {
    if (message.sender.name === 'Pai') {
      const stage = await Chatbot.getStage(message);

      try {
        resp = await stages[stage].obj.execute(message);
      } catch (error) {
        console.log(`[LOG]: ${error}`);
      }

      for (let index = 0; index < resp.length; index++) {
        const element = resp[index];
        client.sendText(message.from, element);
      }
    }
  });
}

exports.ChatbotServiceStart = ChatbotServiceStart;