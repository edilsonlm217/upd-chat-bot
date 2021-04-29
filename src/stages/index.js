var stages = {
  0: {
    descricao: "Estágio de boas vindas",
    obj: require("./stage0"),
  },
  1: {
    descricao: "Estágio de apresentação de menus",
    obj: require("./stage1"),
  },
  2: {
    descricao: "Ler resposta do usuário",
    obj: require("./stage2"),
  },
};

exports.stages = stages;
