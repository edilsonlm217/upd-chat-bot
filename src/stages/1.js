const { db } = require("../models/banco");
const planos = require("../messages/planos");

function execute(user, msg, contato) {
  switch (msg) {
    case 1:
      return [planos];

    default:
      db[user].stage = 2;

      // TO-DO: Recuperar informações do cliente com o CPF informado

      return [
        `Olá ${user}

        Digite o número correspondente a opção desejada:
        
        1️⃣ - Nossos planos
        2️⃣ - Canais de atendimento
        3️⃣ - Desbloqueio de confiança
        4️⃣ - Segunda via de fatura
        5️⃣ - Falar com atendente
        #️⃣ - Finalizar/consultar outro CPF/CNPJ`,
      ];
  }
}

exports.execute = execute;