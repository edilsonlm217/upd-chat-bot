const { InService } = require("../database/schema/InService");

async function execute(message) {
  const { body } = message;
  const isValidCPF = body.length === 11 ? true : false;

  const [senderId,] = message.sender.id.split('@c.us');
  const service = await InService.findOne({ senderId });

  var response = '';

  if (isValidCPF) {
    service.serviceType = 'attached';
    await service.save();

    response = `Ola cliente,
      Para qual desses assuntos deseja atendimento:
      1. Financeiro
      2. Suporte tecnico
      3. Canais de atendimento
      4. Nossos planos
      5. Falar com atendente
      #. Finalizar o atendimento`;
  }

  if (body == 1) {
    response = `Okay. Vamos lá!
    Para qual desses assuntos deseja atendimento:
    1. Conhecer planos
    2. Verificar área de cobertura
    #. Finalizar atendimento`;
  }

  if (response === '') {
    response = 'Opção inválida';
    return [response];
  }

  service.stage = 2;
  await service.save();

  return [response];
}

exports.execute = execute;