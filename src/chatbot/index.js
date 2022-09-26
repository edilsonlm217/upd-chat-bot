const bot = require('venom-bot');

export default new function Chatbot() {
  const sessions = {};

  function constructor() { }

  const ChatbotPrototype = { sessions: sessions }

  constructor.prototype = ChatbotPrototype;

  let instance = new constructor();
  return instance;
}