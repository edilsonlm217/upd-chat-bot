import User from '../schemas/User';

class UserController {
    async store(req, res) {
        const { user } = req.body;
        const cnpjAlreadyExists = await User.findOne({ cnpj: user.cnpj });
        const loginAlreadyExists = await User.findOne({ login: user.login });
        const sessionNameAlreadyExists = await User.findOne({ sessionName: user.sessionName });

        if (cnpjAlreadyExists) {
            return res.status(400).json({
                status: 400,
                error: "CNPJ already exists on database",
                description: "This CNPJ number is already registered in database"
            });
        }

        if (loginAlreadyExists) {
            return res.status(400).json({
                status: 400,
                error: "Login already exists on database",
                description: "This login is already in use"
            });
        }

        if (sessionNameAlreadyExists) {
            return res.status(400).json({
                status: 400,
                error: "SessionName already exists on database",
                description: "This login is already in use"
            });
        }

        const newUser = await User.create(user);
        return res.json(newUser);
    }
}

export default new UserController();
