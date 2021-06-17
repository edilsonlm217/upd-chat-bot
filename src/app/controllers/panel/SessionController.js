import jwt from 'jsonwebtoken';

import auth from '../../../config/auth';
import Tenant from '../../schema/Tenant';

class SessionController {
  async store(req, res) {
    const { login, password } = req.body;

    const user = await Tenant.findOne({
      login,
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (!(user.password === password)) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { _id: userId, name } = user;

    const token = jwt.sign({ userId }, auth.secret, {
      expiresIn: auth.expiresIn,
    })

    return res.json({
      user: {
        id: userId,
        name,
      },
      token,
    });
  }
}

export default new SessionController();
