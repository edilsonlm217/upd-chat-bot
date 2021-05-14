export default async function CompletionStage(attndnce, message) {
  var response = null;

  try {
    switch (message.body) {
      case "0":
        attndnce.stage = 'selecting_area_as_client';
        await attndnce.save();

        response = ['Para qual desses assuntos deseja atendimento:\n\n1. Financeiro\n2. Suporte\n3. Falar com atendente'];
        break;

      case "#":
        response = ['Atendimento finalizado!\nUpdata Telecom agradece!'];
        // TODO: Remover atendimento da lista de atendimentos
        break;

      default:
        break;
    }
  } catch (error) {
    console.log('[LOG]: Failed @ CompletionStage');
    console.log(error);
  }
}