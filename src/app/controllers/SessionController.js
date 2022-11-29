import { getSessionByClientAccount } from "../../services/WhatsappAgent";

class SessionController {
    async show(req, res) {
        const { sessionName } = req.params;
        const session = getSessionByClientAccount(sessionName);

        if (!session) {
            const error = {
                title: "Bad Request",
                detail: "There is no session owned by this user",
                status: 400,
            };
            console.error(error);
            return res.status(400).json(error);
        }

        return res.status(200).json({
            session: {
                name: sessionName,
            }
        });
    }
}

export default new SessionController();
