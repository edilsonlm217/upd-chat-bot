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
  try {
    const providers = await Tenant.find({ isActive: true });

    if (!providers) {
      return;
    }

    providers.map(async tenant => {
      const { sessionName, dialect, host, username, password, database, port } = tenant;

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
      } catch (error) {
        console.log(`[LOG]: ${error}`);
      }
    });
  } catch (error) {
    console.log('[LOG]: Failed to load tenants DB');
  }
}

function switchDatabase(sessionName) {
  const sqlConnection = tenantDatabaseConnections[sessionName];

  models.map(model => model.init(sqlConnection));

  return true;
}

export { loadTenantConnections, switchDatabase };
