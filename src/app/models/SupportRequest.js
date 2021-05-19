import Sequelize, { Model } from 'sequelize';

class SupportRequest extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
        },
        uuid_suporte: Sequelize.STRING,
        assunto: Sequelize.STRING,
        abertura: Sequelize.STRING,
        fechamento: Sequelize.STRING,
        email: Sequelize.STRING,
        status: Sequelize.STRING,
        chamado: Sequelize.STRING,
        nome: Sequelize.STRING,
        login: Sequelize.STRING,
        atendente: Sequelize.STRING,
        visita: Sequelize.STRING,
        prioridade: Sequelize.STRING,
        ramal: Sequelize.STRING,
        reply: Sequelize.STRING,
        tecnico: Sequelize.INTEGER,
        login_atend: Sequelize.STRING,
        motivo_fechar: Sequelize.STRING,
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
