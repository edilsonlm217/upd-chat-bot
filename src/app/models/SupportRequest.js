import Sequelize, { Model } from 'sequelize';

class SupportRequest extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
        },
        tecnico: Sequelize.INTEGER,
        nome: Sequelize.STRING,
        login: Sequelize.STRING,
        status: Sequelize.STRING,
        assunto: Sequelize.STRING,
        visita: Sequelize.DATE,
        chamado: Sequelize.STRING,
        fechamento: Sequelize.STRING,
        motivo_fechar: Sequelize.STRING,
        prioridade: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'sis_suporte',
      }
    );

    return this;
  }
}

export default SupportRequest;
