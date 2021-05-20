import { addHours, format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

import Client from '../../../app/models/Client';
import SupportRequest from '../../../app/models/SupportRequest';

export default async function ProcedureCheckStage(attndnce, message) {
  var response = null;

  try {
    switch (message.body) {
      case "1":
        attndnce.stage = 'completion';
        await attndnce.save();

        response = ['Tudo certo!\n\nPrecisa de mais alguma coisa?\n0. Voltar menu principal\n#. Finalizar atendimento'];
        break;

      case "2":
        const client = await Client.findByPk(attndnce.client.id);

        const requestNumber = format(new Date(), 'ddMMyyhhmmssSS');
        const requestVisit = addHours(new Date(), 72);

        const request = await SupportRequest.create({
          uuid_suporte: uuidv4(),
          assunto: 'Outros',
          abertura: format(new Date(), 'yyyy-MM-dd hh:mm:ss'),
          fechamento: null,
          email: client.email,
          status: 'aberto',
          chamado: requestNumber,
          nome: client.nome,
          login: client.login,
          atendente: 'chatbot',
          visita: format(requestVisit, 'yyyy-MM-dd hh:mm:ss'),
          prioridade: 'normal',
          ramal: 'todos',
          reply: 'nao',
          tecnico: null,
          login_atend: 'full_users',
          motivo_fechar: null,
        });

        attndnce.stage = 'completion';
        await attndnce.save();

        response = [
          `Neste caso, abri um chamado para um especialista verificar o seu problema.\n\nSegue número do protocolo: ${request.chamado}`,
          'Precisa de mais alguma coisa?\n0. Voltar menu principal\n#. Finalizar atendimento'
        ];
        break;

      default:
        response = ['Opção inválida'];
        break;
    }

    return response;
  } catch (error) {
    console.log('[LOG]: Failed @ ProcedureCheckStage');
    console.log(error);
  }
}