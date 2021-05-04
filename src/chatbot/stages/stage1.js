import InService from '../../app/schema/InService';
import Client from '../../app/models/Client';

function handleResponse(message) {
  const isValidCPF = message.body.length === 11 ? true : false;

  if (isValidCPF) {
    return 'attached';
  }

  if (message.body == 1) {
    return 'detached';
  }

  return 'invalid_response';
}

async function goNextStage(message, serviceType) {
  const { sender } = message;
  const [senderId,] = sender.id.split('@c.us');

  const service = await InService.findOne({ senderId });

  service.serviceType = serviceType;
  service.stage = 2;
  await service.save();
}

async function getClientDetails(message) {
  const client = await Client.findOne({
    where: {
      cpf_cnpj: message.body,
    },
  });

  return client;
}

async function execute(message) {
  const serviceType = handleResponse(message);

  var response = [];
  var msg = null;

  switch (serviceType) {
    case 'attached':
      const client = await getClientDetails(message);

      await goNextStage(message, serviceType);

      const [firstName] = client.nome.split(' ');

      msg = `Ola ${firstName}
        Para qual desses assuntos deseja atendimento:
        1. Financeiro
        2. Suporte tecnico
        3. Canais de atendimento
        4. Nossos planos
        5. Falar com atendente
        #. Finalizar o atendimento
      `;

      response.push(msg);
      break;

    case 'detached':
      await goNextStage(message, serviceType);

      msg = `Okay. Vamos lá!
        Para qual desses assuntos deseja atendimento:
        1. Conhecer planos
        2. Verificar área de cobertura
        #. Finalizar atendimento
      `;

      response.push(msg);
      break;

    default:
      msg = 'Opção inválida';
      response.push(msg);
      break;
  }

  return response;
}

exports.execute = execute;