const { InService } = require("../database/schema/InService");

async function execute(message) {
  stamp = new Date();
  hours = stamp.getHours();

  if (hours >= 18 && hours < 24) {
    time = "Boa noite"
  } else if (hours >= 12 && hours < 18) {
    time = "Boa tarde"
  } else if (hours >= 0 && hours < 12) {
    time = "Bom dia"
  }

  const { sender } = message;
  const [senderId,] = sender.id.split('@c.us');

  const service = await InService.findOne({ senderId });

  service.stage = 1;
  await service.save();

  return [
    `${time}. Seja bem vindo(a)!
    Aqui é a assistente virtual da Updata.
    
    Digite *[1] para atendimento avulso* ou *informe CPF ou CNPJ* caso seja assinante de nossos serviços`,
  ];
}

exports.execute = execute;