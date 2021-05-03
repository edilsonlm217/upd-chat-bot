import Sequelize from 'sequelize';
import Tenant from '../../app/schema/Tenant';

import Client from '../../app/models/Client';
// Demais models

const models = [
  Client,
  // Demais models
];

const tenantDatabaseConnections = {};

async function loadTenantConnections() {
  const providers = await Tenant.find({ isActive: true });

  if (!providers) {
    return;
  }

  providers.map(async tenant => {
    const { sessionName, dialect, host, username, password, database } = tenant;

    try {
      const connection = await new Sequelize({
        dialect,
        host,
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
    } catch (error) {
      console.log(`[LOG]: ${error}`);
    }
  });
}

async function switchDatabase(sessionName) {
  const sqlConnection = tenantDatabaseConnections[sessionName];

  models.map(model => model.init(sqlConnection));
}

export { loadTenantConnections, switchDatabase };
