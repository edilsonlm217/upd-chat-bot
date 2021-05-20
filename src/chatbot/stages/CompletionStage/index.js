export default async function CompletionStage(attndnce, message) {
  var response = null;

  try {
    switch (message.body) {
      case "0":
        attndnce.stage = 'selecting_area_as_client';
        await attndnce.save();

        response = ['Para qual desses assuntos deseja atendimento:\n\n1. Financeiro\n2. Suporte'];
        break;

      case "#":
        await attndnce.remove();

        response = ['Atendimento finalizado!\nUpdata Telecom agradece!'];
        break;

      default:
        break;
    }

    return response;
  } catch (error) {
    console.log('[LOG]: Failed @ CompletionStage');
    console.log(error);
  }
}