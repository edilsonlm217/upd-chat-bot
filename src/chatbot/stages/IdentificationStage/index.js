import Client from '../../../app/models/Client';

export default async function IdentificationStage(attndnce, message) {
  try {
    const regex = /([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})/;

    const isValidCPFCNPJ = regex.test(message.body);

    if (message.body === '1') {
      return ['Para qual desses assuntos deseja atendimento:\n\n1. Conhecer planos\n2. Falar com atendente'];
    }

    if (isValidCPFCNPJ) {
      const client = await Client.findOne({
        where: {
          cpf_cnpj: message.body,
          cli_ativado: "s",
        },
      });

      if (!client) {
        attndnce.stage = 'identification';
        await attndnce.save();

        return [
          'Informe outro CPF ou CNPJ para começarmos.\n\nSe ainda não é cliente digite[1].',
          'Não há nenhuma assinatura para este CPF em nosso sistema.'
        ];
      }

      attndnce.stage = 'selecting_area_as_client';
      attndnce.isClient = true;
      attndnce.client = client.dataValues;
      await attndnce.save();

      return ['Para qual desses assuntos deseja atendimento:\n\n1. Financeiro\n2. Suporte\n3. Falar com atendente'];
    }

    return ['Opção inválida'];
  } catch (error) {
    console.log('[LOG]: Failed @ IdentificationStage');
    console.log(error);
  }
}