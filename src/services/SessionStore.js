const sessions = {};

function SaveSession(session, sessionName) {
    sessions[sessionName] = session;
}

function GetSessionBySessionName(sessionName) {
    return sessions[sessionName];
}

export { SaveSession, GetSessionBySessionName }