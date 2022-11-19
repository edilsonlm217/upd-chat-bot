const venom = require('venom-bot');
import socketio from 'socket.io';

const sessions = {};

function registerWhatsappAgent(venomSession, client) {
    sessions[client] = venomSession;
    console.log(sessions);
}

function getSessionByClientAccount(client) {
    return sessions[client];
}

export { registerWhatsappAgent, getSessionByClientAccount }