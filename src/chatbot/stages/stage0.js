import InService from '../../app/schema/InService';

function getHours() {
  const stamp = new Date();
  const hours = stamp.getHours();
  var time = null;

  if (hours >= 18 && hours < 24) {
    time = "Boa noite"
  } else if (hours >= 12 && hours < 18) {
    time = "Boa tarde"
  } else if (hours >= 0 && hours < 12) {
    time = "Bom dia"
  }

  return time;
}

async function goNextStage(message) {
  const { sender } = message;
  const [senderId,] = sender.id.split('@c.us');

  const service = await InService.findOne({ senderId });

  service.stage = 1;
  await service.save();
}

async function execute(message) {
  const time = getHours();

  try {
    await goNextStage(message);

    return [
      `${time}.\nPra começar informe seu CPF ou CNPJ.\nSe ainda não é cliente digite [1]`,
    ];
  } catch (error) {
    console.log('[LOG]: Failed to execute stage 0');
    console.log(error);
  }
}

exports.execute = execute;