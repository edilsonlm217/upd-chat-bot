import { isValidObjectId } from 'mongoose';
import fs from 'fs';
import { promisify } from 'util';
import Chatbot from '../../../chatbot/index';

import Tenants from '../../schema/Tenant';

const readDirAsync = promisify(fs.readdir);

class VenomSessionController {
  async show(req, res) {
    const { userId } = req.params;

    // É um ID válido?
    const isValidId = isValidObjectId(userId);

    if (!isValidId) {
      return res.status(400).json({
        error: {
          cause: 'Invalid userId',
          message: 'This is not a valid mongo object id'
        }
      });
    }

    // O tenant existe?
    const Tenant = await Tenants.findById(userId);

    if (!Tenant) {
      return res.status(400).json({
        error: {
          cause: 'User does not exists',
          message: `There's no Tenant associated with this userId`,
        }
      });
    }

    // Tem alguma sessão pra esse tenant?
    var session = null;

    const tokens = await readDirAsync('./tokens');

    tokens.forEach(file => {
      const [sessionName] = file.split('.data.json');

      if (sessionName === Tenant.cnpj) {
        session = Chatbot.onlineSessions[Tenant.cnpj];
      }
    });

    if (!session) {
      return res.status(400).json({
        error: {
          cause: `There's no session for this tenant`,
          message: `There's no session initialized for this tenant`,
        }
      });
    }

    const responseObject = {
      isConnected: await session.isConnected(),
      isLoggedIn: await session.isLoggedIn(),
      getBatteryLevel: await session.getBatteryLevel(),
    }

    return res.json(responseObject);
  }

  async update(req, res) {
    const { tenantCnpj } = req.body;

    Chatbot.shutDownTenatBot(tenantCnpj);

    return res.send();
  }
}

export default new VenomSessionController();
