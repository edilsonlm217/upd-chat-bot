import InService from '../../app/schema/InService';

import Client from '../../app/models/Client';

async function execute(message) {
  const { body } = message;
  const isValidCPF = body.length === 11 ? true : false;

  const [senderId,] = message.sender.id.split('@c.us');
  const service = await InService.findOne({ senderId });

  var response = '';

  if (isValidCPF) {
    // const client = await Client.findOne({
    //   where: {
    //     cpf_cnpj: body,
    //   },
    // });

    // const [clientName] = client.nome.split(' ');

    service.serviceType = 'attached';
    await service.save();

    response = `Ola clientName
    Para qual desses assuntos deseja atendimento:
    1. Financeiro
    2. Suporte tecnico
    3. Canais de atendimento (não implementado)
    4. Nossos planos (não implementado)
    5. Falar com atendente (não implementado)
    #. Finalizar o atendimento`;
  }

  if (body == 1) {
    response = `Okay. Vamos lá!
    Para qual desses assuntos deseja atendimento:
    1. Conhecer planos
    2. Verificar área de cobertura
    #. Finalizar atendimento`;
  }

  if (response === '') {
    response = 'Opção inválida';
    return [response];
  }

  service.stage = 2;
  await service.save();

  return [response];
}

exports.execute = execute;