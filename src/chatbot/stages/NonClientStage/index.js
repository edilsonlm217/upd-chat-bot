export default async function NonClientStage(attndnce, message) {
  var response = null;

  try {
    switch (message.body) {
      case "1":
        attndnce.stage = 'completion';
        await attndnce.save();

        response = [
          'Precisa de mais alguma coisa?\n0. Voltar menu principal\n#. Finalizar atendimento\n',
          'Temos o plano ideal para você:\n\nPLANOS COM CABO\nBásico 5 Megas: R$ 50,00 / mês\nEconômico 10 Megas: R$ 70,00 / mês\n\nPLANOS COM FIBRA*\nPadrão 20 Megas: R$ 100,00 / mês\nProfissional 30 Megas: R$ 120,00 / mês\nSmart 50 Megas: R$ 150,00 / mês\nTopFibra 100 Megas: R$ 200,00 / mês\n\n- Taxa de ativação R$ 100,00\n- Roteador* R$ 100,00\n\n(*) nos planos a partir de 50 megas WIFI grátis com roteador em comodato\n\nPara contratar acesse:\nwww.updata.com.br/planos'
        ];
        break;

      case "2":
        attndnce.stage = 'completion';
        await attndnce.save();

        response = [
          'Precisa de mais alguma coisa?\n0. Voltar menu principal\n#. Finalizar atendimento',
          'Um de nossos atendentes entrará em contato com você o mais breve possível'
        ];

        // TODO: Notificar atendentes
        // TODO: Remover atendimento da lista de atendimentos
        break;
      default:
        break;
    }
  } catch (error) {
    console.log('[LOG]: Failed @ NonClientStage');
    console.log(error);
  }
}