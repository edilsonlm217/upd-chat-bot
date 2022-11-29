import User from "../schemas/User";

class AuthController {
    async index(req, res) {
        const { login, password } = req.body;

        if (!login || !password) {
            return res.status(401).json({
                status: 401,
                error: "Bad Request",
                description: "The request is missing required params"
            });
        }

        const user = await User.findOne({ login });

        if (!user) {
            return res.status(401).json({
                status: 401,
                error: "Invalid User",
                description: "User not found"
            });
        }

        if (password !== user.password) {
            return res.status(401).json({
                status: 401,
                error: "Invalid password",
                description: "Password is invalid"
            });
        }

        delete user['password'];

        return res.json({
            user: {
                id: user.id,
                name: user.name,
                cnpj: user.cnpj,
                sessionName: user.sessionName,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });
    }
}

export default new AuthController();
