import Tenant from '../schema/Tenant';

class TenantController {
  async create(req, res) {
    const { nome, cnpj } = req.body;
    const { dialect, host, username, password, database, port } = req.body;

    const tenant = await Tenant.create({
      nome,
      cnpj,
      dialect,
      host,
      port,
      username,
      password,
      database,
    });

    return res.json(tenant);
  }
}

export default new TenantController();
