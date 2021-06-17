import * as yup from 'yup';

import Tenant from '../../schema/Tenant';

let schema = yup.object().shape({
  name: yup.string().required(),
  companyName: yup.string().required(),
  cnpj: yup.string().required(),
  phoneNumber: yup.string().required(),
  email: yup.string().email().required(),
  login: yup.string().required(),
  password: yup.string().required(),
  dbHost: yup.string().required(),
  dbPort: yup.string().required(),
});

class AccountController {
  async store(req, res) {
    const isReqValid = await schema.isValid(req.body);

    if (!isReqValid) {
      return res.status(400).json({
        error: 'Todos os campos são obrigatórios'
      });
    }

    const { companyName, cnpj, email } = req.body;

    // Verifica se companyName já existe no database
    var alreadyExists = await Tenant.findOne({
      companyName,
    });

    if (alreadyExists) {
      return res.status(400).json({
        error: 'Este nome de empresa já está em uso'
      });
    }

    // Verifica se cnpj já existe no database
    var alreadyExists = await Tenant.findOne({
      cnpj,
    });

    if (alreadyExists) {
      return res.status(400).json({
        error: 'Este CNPJ já está em uso'
      });
    }

    // Verifica se email já existe no database
    var alreadyExists = await Tenant.findOne({
      email,
    });

    if (alreadyExists) {
      return res.status(400).json({
        error: 'Este e-mail já está em uso'
      });
    }

    const newTenant = await Tenant.create({
      name: req.body.name,
      companyName: companyName,
      cnpj: cnpj,
      phoneNumber: req.body.phoneNumber,
      email: email,
      login: req.body.login,
      password: req.body.password,
      dbHost: req.body.dbHost,
      dbPort: req.body.dbPort,
      sessionName: cnpj,
    });

    return res.json(newTenant);
  }
}

export default new AccountController();
