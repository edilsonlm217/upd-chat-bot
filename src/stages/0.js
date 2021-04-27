const { db } = require("../models/banco");

function execute(user, msg, contato) {
  // Obtem a hora atual do PC para definir se vai ser Bom dia, tarde ou noite.
  stamp = new Date();
  hours = stamp.getHours();
  if (hours >= 18 && hours < 24) {
    time = "Boa noite"
  } else if (hours >= 12 && hours < 18) {
    time = "Boa tarde"
  } else if (hours >= 0 && hours < 12) {
    time = "Bom dia"
  }

  db[user].stage = 1;

  return [
    `Olá, ${time}
    Sou o atendente virtual da Updata
    
    Informe o CPF ou CNPJ, *sem ponto e sem traço*, para o qual deseja atendimento.
    
    Se ainda não é nosso cliente digite 1️⃣`,
  ];
}

exports.execute = execute;