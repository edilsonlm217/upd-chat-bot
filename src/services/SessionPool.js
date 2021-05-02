import Tenant from '../app/schema/Tenant';
const venom = require('venom-bot');

async function getActiveTenants() {
  const tenants = await Tenant.find({
    isActive: true,
  });

  return tenants;
}

class SessionPool {
  constructor() {
    this.sessions = { /* sessionName: session */ };
  }

  add(client) {
    this.sessions[client.session] = client;
    console.log(this.sessions);
  }

  preloadSessions() {
    console.log('[LOG]: Preloading existing sessions');

    getActiveTenants().then((tenants) => {
      tenants.map(tenant => {
        const { sessionName } = tenant;

        venom.create(
          sessionName,
          undefined,
          undefined,
          {
            logQR: false,
            disableWelcome: true,
            autoClose: 30000,
          }
        ).then(
          client => {
            this.sessions[client.session] = client;
            console.log(`[LOG]: ${sessionName}'s session has been preloaded`);
            //
          }
        ).catch(error => {
          console.log(error);
        });

      });
    });
  }
}

export default new SessionPool();
