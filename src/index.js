const { Chatbot } = require("./services/Chatbot");

async function ChatbotServiceStart() {
  const client = await Chatbot.start();

  client.onMessage(async message => {
    if (message.sender.name === 'Pai') {
      const stage = await Chatbot.getStage(message);
      console.log(stage);
    }
  });
}

exports.ChatbotServiceStart = ChatbotServiceStart;