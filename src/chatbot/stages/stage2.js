import InService from '../../app/schema/InService';

const attachedResponses = {
  '1': 'Financeiro',
  '2': 'Suporte tecnico',
  '3': 'Canais de atendimento',
  '4': 'Nossos planos',
  '5': 'Falar com atendente',
  '#': 'Finalizar o atendimento',
};

const detachedResponses = {
  '1': 'Nossos planos',
  '2': 'Canais de atendimento',
  '#': 'Finalizar o atendimento',
};

async function handleResponse(message, serviceType) {
  var response = undefined;

  switch (serviceType) {
    case 'attached':
      response = attachedResponses[message.body];

      if (!response) {
        return 'Opção inválida';
      }

      return response;

    case 'detached':
      response = detachedResponses[message.body];

      if (!response) {
        return 'Opção inválida';
      }

      return response;
  }
}

async function getServiceType(message) {
  const [senderId,] = message.sender.id.split('@c.us');
  const service = await InService.findOne({ senderId });
  if (service.serviceType === 'attached') {
    return {
      service,
      serviceType: 'attached',
    };
  }

  return {
    service,
    serviceType: 'detached',
  };
}

async function goNextStage(service) {
  service.stage = 3;
  await service.save();
}

async function execute(message) {
  const { service, serviceType } = await getServiceType(message);
  const selectedOption = await handleResponse(message, serviceType);

  var response = [];
  var msg = null;

  switch (selectedOption) {
    case 'Financeiro':
      service.menuStage = selectedOption;
      await service.save();

      msg = `*MenuFinanceiro*
        1. Segunda via de fatura
        2. Desbloqueio de confiança
        *. Falar com atendente
        0. Menu principal
        #. Finalizar atendimento
      `;

      await goNextStage(service);
      response.push(msg);
      break;

    case 'Suporte tecnico':
      service.menuStage = selectedOption;
      await service.save();

      msg = `*MenuSuporte*
        1. Sem internet
        2. Internet lenta
        3. Consultar chamado
        *. Falar com atendente
        0. Menu principal
        #. Finalizar atendimento
      `;

      await goNextStage(service);
      response.push(msg);
      break;

    case 'Canais de atendimento':
      msg = `Este menu ainda não foi implementado. Selecione outra opção.`;
      response.push(msg);
      break;

    case 'Nossos planos':
      msg = `Este menu ainda não foi implementado. Selecione outra opção.`;
      response.push(msg);
      break;

    case 'Falar com atendente':
      msg = `Este menu ainda não foi implementado. Selecione outra opção.`;
      response.push(msg);
      break;

    case 'Finalizar o atendimento':
      await service.remove();
      msg = 'Atendimento finalizado. Obrigado pelo contato';
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