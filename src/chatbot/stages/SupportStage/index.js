import Client from '../../../app/models/Client';
import OnlineUsers from '../../../app/models/OnlineUsers';

export default async function SupportStage(attndnce, message) {
  var response = null;

  try {
    switch (message.body) {
      case "1":
        const isOnline = await OnlineUsers.findByPk(attndnce.client.id);

        // Verifica se o client está online
        if (!isOnline) {
          //TODO: Abrir chamado

          attndnce.stage = 'completion';
          await attndnce.save();

          response = [
            'Realmente parece haver um problema com sua conexão.',
            'Neste caso, abri um chamado para um especialista verificar o seu problema.\nSegue número do protocolo: 12312312321',
            'Precisa de mais alguma coisa?\n0. Voltar\n#.Finalizar atendimento'
          ];
        }

        // Verifica se o client está bloqueado
        const client = await Client.findByPk(attndnce.client.id);
        const { bloqueado } = client;

        if (bloqueado === 'nao') {
          attndnce.stage = 'support_1_1';
          await attndnce.save();

          response = [
            'Verifiquei que sua conexão está online e aparentemente normal.\nSugiro que desligue o roteador, aguarde 1 minuto e ligue novamente\n\nApós realizar o procedimento acima, seu problema foi resolvido?\n\n1. Sim\n2.Não',
          ];
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
        if (differenceInDays(new Date(), client.rem_obs) <= 30) {
          attndnce.stage = 'completion';
          await attndnce.save();

          response = [
            'Verifiquei que já foi realizado o desbloqueio de confiança recentemente.\nSeu serviço será restabelecido após a confirmação do pagamento pela instituição bancária.',
            'Precisa de mais alguma coisa?\n0. Voltar menu principal\n#. Finalizar atendimento'
          ];

          break;
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
        //
        break;

      case "0":
        attndnce.stage = 'selecting_area_as_client';
        await attndnce.save();

        response = ['Para qual desses assuntos deseja atendimento:\n\n1. Financeiro\n2. Suporte\n3. Falar com atendente'];
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