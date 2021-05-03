import Sequelize from 'sequelize';
import Tenant from '../app/schema/Tenant';

import Client from '../app/models/Client';

const models = [Client];

const tenantDatabaseConnections = {};

export default new function ConnectionResolver() {
  function constructor() { }

  function switchDatabase(sessionName) {
    const sqlConnection = tenantDatabaseConnections[sessionName];

    models.map(model => model.init(sqlConnection));

    return true;
  }

  async function loadTenantConnections() {
    try {
      const providers = await Tenant.find({ isActive: true });

      if (!providers) {
        return;
      }

      providers.map(async tenant => {
        const { sessionName } = tenant;
        const { dialect, host, username, password, database, port } = tenant;

        try {
          const connection = await new Sequelize({
            dialect,
            host,
            port,
            username,
            password,
            database,
            define: {
              timestamps: false,
              underscored: true,
              underscoredAll: true,
            },
          });

          tenantDatabaseConnections[sessionName] = connection;
          console.log(`[LOG]: Successfully connected to tenant's database`);
        } catch (error) {
          console.log(`[LOG]: Failed to connect to tenant's database`);
        }
      });
    } catch (error) {
      console.log('[LOG]: Failed to load tenants DB');
    }
  }

  const ConnectionResolvertPrototype = {
    init: () => {
      loadTenantConnections();
    },
    switchDatabase: (sessionName) => { switchDatabase(sessionName) }
  }

  constructor.prototype = ConnectionResolvertPrototype;

  let instance = new constructor();
  return instance;
}