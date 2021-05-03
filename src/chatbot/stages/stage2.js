import InService from '../../app/schema/InService';

async function execute(message) {
  try {
    const [senderId,] = message.sender.id.split('@c.us');
    const service = await InService.findOne({ senderId });

    var response = '';

    const { serviceType } = service;

    switch (serviceType) {
      case 'attached':
        const { body } = message;

        // 1. Financeiro
        // 2. Suporte tecnico
        // 3. Canais de atendimento
        // 4. Nossos planos
        // 5. Falar com atendente
        // #. Finalizar o atendimento`

        if (body === '#') {
          await service.remove();
          return ["Atendimento finalizado com sucesso"];
        }

        if (body == 1) {
          response = `*MenuFinanceiro*
          1. Segunda via de fatura *(não implementado)*
          2. Desbloqueio de confiança *(não implementado)*
          3. Cancelamento *(não implementado)*
          4. Falar com atendente *(não implementado)*
          0. Menu principal *(não implementado)*
          #. Finalizar atendimento *(não implementado)*`;
        }

        if (body == 2) {
          response = `*MenuSuporte*
          1. Sem internet *(não implementado)*
          2. Internet lenta *(não implementado)*
          3. Senha do wifi *(não implementado)*
          4. Consultar chamado *(não implementado)*
          5. Falar com atendente *(não implementado)*
          0. Menu principal *(não implementado)*
          #. Finalizar atendimento *(não implementado)*`;
        }

        break;

      case 'detached':
        // const { body } = message;
        //
        break;
    }

    return [response];
  } catch (error) {
    console.log('[LOG]: Failed to execute stage 2');
  }
}

exports.execute = execute;