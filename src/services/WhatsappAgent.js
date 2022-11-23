const sessions = {};

function registerWhatsappAgent(venomSession, client) {
    sessions[client] = venomSession;
}

function getSessionByClientAccount(client) {
    return sessions[client];
}

export { registerWhatsappAgent, getSessionByClientAccount }