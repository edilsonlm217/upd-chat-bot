var stages = {
  0: {
    descricao: "Welcome stage",
    obj: require("./stage0"),
  },
  1: {
    descricao: "Ler resposta do usuário",
    obj: require("./stage1"),
  },
};

exports.stages = stages;
