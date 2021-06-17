import Tenant from '../../app/schema/Tenant';
import Sequelize from 'sequelize';

class Database {
  connections = {};

  async start() {
    try {
      const providers = await Tenant.find({ isActive: true });

      if (!providers) {
        return;
      }

      providers.map(async tenant => {
        const { sessionName } = tenant;
        const { dbHost, dbUsername, dbPassword, dbName, dbPort } = tenant;

        try {
          const connection = await new Sequelize({
            dialect: 'mariadb',
            host: dbHost,
            port: dbPort,
            username: dbUsername,
            password: dbPassword,
            database: dbName,
            define: {
              timestamps: false,
              underscored: true,
              underscoredAll: true,
            },
          });

          this.connections[sessionName] = connection;
          console.log(`[LOG]: Successfully connected to tenant's database`);
        } catch (error) {
          console.log(`[LOG]: Failed to connect to tenant's database`);
          console.log(error);
        }
      });
    } catch (error) {
      console.log('[LOG]: Failed to load tenants DB');
    }
  }
}

export default new Database();
