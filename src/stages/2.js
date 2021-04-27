const { db } = require("../models/banco");
const planos = require("../messages/planos");

function execute(user, msg, contato) {
  console.log(msg);
  switch (msg) {
    case 1:
      return [planos];

    case 2:
      return ['Você escolheu 2'];

    case 3:
      return ['Você escolheu 3'];

    case 4:
      return ['Você escolheu 4'];

    case 5:
      return ['Você escolheu 5'];

    case 6:
      return ['Você escolheu 6'];

    default:
      break;
  }
}

exports.execute = execute;