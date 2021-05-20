import { differenceInDays, startOfDay, addHours, format, isSameDay } from 'date-fns';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

import Client from '../../../app/models/Client';
import OnlineUsers from '../../../app/models/OnlineUsers';
import SupportRequest from '../../../app/models/SupportRequest';
import Invoice from '../../../app/models/Invoice';

export default async function SupportStage(attndnce, message) {
  var response = null;

  try {
    const client = await Client.findByPk(attndnce.client.id);

    switch (message.body) {
      case "1":
        const isOnline = await OnlineUsers.findByPk(attndnce.client.id);

        // Verifica se o client está online
        if (!isOnline) {
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
            'Realmente parece haver um problema com sua conexão.',
            `Neste caso, abri um chamado para um especialista verificar o seu problema.\nSegue número do protocolo: ${request.chamado}`,
            'Precisa de mais alguma coisa?\n0. Voltar\n#.Finalizar atendimento'
          ];

          break;
        }

        // Verifica se o client está bloqueado
        const { bloqueado: isBlocked } = client;

        if (isBlocked === 'nao') {
          attndnce.stage = 'procedure_check';
          await attndnce.save();

          response = [
            'Verifiquei que sua conexão está online e aparentemente normal.\nSugiro que desligue o roteador, aguarde 1 minuto e ligue novamente\n\nApós realizar o procedimento acima, seu problema foi resolvido?\n\n1. Sim\n2.Não',
          ];

          break;
        }

        // Verificar se cliente está apto a desbloqueio de segurança em duas etapas
        // Etapa_1: Verificar se cliente já está em observação
        if (client.observacao === 'sim') {
          attndnce.stage = 'completion';
          await attndnce.save();

          response = [
            'Verifiquei que já foi realizado o desbloqueio de confiança recentemente.\nSeu serviço será restabelecido após a confirmação do pagamento pela instituição bancária.',
            'Precisa de mais alguma coisa?\n0. Voltar menu principal\n#. Finalizar atendimento'
          ];

          break;
        }

        // Etapa_2: Verificar se cliente já usou bloqueio de confiança nos últimos 30 dias
        const timeZoneOffset = new Date().getTimezoneOffset() / 60;
        const today = subHours(startOfDay(new Date()), timeZoneOffset);

        const isSameDay_ = isSameDay(today, client.rem_obs);

        if (!isSameDay_) {
          if (differenceInDays(today, client.rem_obs) <= 30) {
            attndnce.stage = 'completion';
            await attndnce.save();

            response = [
              'Verifiquei que já foi realizado o desbloqueio de confiança recentemente.\nSeu serviço será restabelecido após a confirmação do pagamento pela instituição bancária.',
              'Precisa de mais alguma coisa?\n0. Voltar menu principal\n#. Finalizar atendimento'
            ];

            break;
          }
        }

        // Colocando cliente em observação
        client.observacao = 'sim';
        client.rem_obs = addHours(startOfDay(new Date()), 72);
        await client.save();

        attndnce.stage = 'completion';
        await attndnce.save();

        response = [
          'Verifiquei que seu serviço está bloquedo por falta de pagamento.\n\nIrei fazer o desbloqueio de confiança. Caso o pagamento não seja confirmado no prazo de 72h o serviço será bloqueado novamente',
          'Pronto! Serviço restabelecido.',
          'Precisa de mais alguma coisa?\n0. Voltar menu principal\n#. Finalizar atendimento'
        ];

        break;

      case "2":
        if (client.status_corte === 'down') {
          const { login } = attndnce.client;

          // Recupera fatura vencida
          const pendingInvoice = await Invoice.findOne({
            where: {
              login: login,
              status: 'vencido',
              deltitulo: {
                [Op.eq]: false,
              },
            },
          });

          attndnce.stage = 'completion';
          await attndnce.save();

          response = [
            'Verifiquei que seu serviço está reduzido devido a uma fatura vencida a mais de 15 dias.\nPara restabelecer sua velocidade, efetue pagamento o quanto antes',
            `Para efetuar o pagamento agora, utilize a linha digitavel abaixo:\n${pendingInvoice.linhadig}`,
            'Precisa de mais alguma coisa?\n0. Voltar menu principal\n#. Finalizar atendimento',
          ];

          break;
        }

        attndnce.stage = 'procedure_check';
        await attndnce.save();

        response = [
          'Verifiquei que sua velocidade não está reduzida. Muitas vezes o problema de lentidão está relacionado com travamento do roteador.\n\nSugiro que desligue o roteador, aguarde 1 minuto e ligue novamente.\n\nApós realizar o procedimento acima, seu problema foi resolvido?\n\n1. Sim\n2. Não',
        ];

        break;

      case "0":
        attndnce.stage = 'selecting_area_as_client';
        await attndnce.save();

        response = ['Para qual desses assuntos deseja atendimento:\n\n1. Financeiro\n2. Suporte'];
        break;

      default:
        response = ['Opção inválida'];
        break;
    }

    return response;
  } catch (error) {
    console.log('[LOG]: Failed @ SupportStage');
    console.log(error);
  }
}