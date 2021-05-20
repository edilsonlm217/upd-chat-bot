export default async function SelectAreaAsClient(attndnce, message) {
  var response = null;

  try {
    switch (message.body) {
      case "1":
        attndnce.stage = 'financial';
        await attndnce.save();

        response = ['*Financeiro*\n1. Segunda via de fatura\n2. Desbloqueio de confiança\n\nTecle [0] para voltar'];
        break;

      case "2":
        attndnce.stage = 'support';
        await attndnce.save();

        response = ['*Suporte*\n1. Sem internet\n2. Internet lenta\n\nTecle [0] para voltar'];
        break;

      default:
        response = ['Opção inválida']
        break;
    }

    return response;
  } catch (error) {
    console.log('[LOG]: Failed @ SelectAreaAsClient');
    console.log(error);
  }
}