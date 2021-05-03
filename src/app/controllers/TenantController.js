import Tenant from '../schema/Tenant';

class TenantController {
  async create(req, res) {
    try {
      const { nome, cnpj } = req.body;
      const { dialect, host, username, password, database, port, sessionName } = req.body;

      const tenant = await Tenant.create({
        nome,
        cnpj,
        dialect,
        host,
        port,
        username,
        password,
        database,
        sessionName,
      });

      return res.json(tenant);
    } catch (error) {
      console.log('[ERROR]: Failed to create tenant');
    }
  }
}

export default new TenantController();
