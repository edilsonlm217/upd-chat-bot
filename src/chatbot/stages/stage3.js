import InService from '../../app/schema/InService';

const financeResponses = {
  '1': 'Segunda via de fatura',
  '2': 'Desbloqueio de confiança',
  '3': 'Cancelamento',
  '4': 'Falar com atendente',
  '0': 'Menu principal',
  '#': 'Finalizar atendimento',
};

const supportResponses = {
  '1': 'Sem internet',
  '2': 'Internet lenta',
  '3': 'Senha do wifi',
  '4': 'Consultar chamado',
  '5': 'Falar com atendente',
  '0': 'Menu principal',
  '#': 'Finalizar atendimento',
};

async function handleResponse(message, menuStage) {
  var response = undefined;

  switch (menuStage) {
    case 'Financeiro':
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

async function execute(message) {
  const { service, menuStage } = await getServiceType(message);
  const selectedOption = await handleResponse(message, menuStage);


}

exports.execute = execute;