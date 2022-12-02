const OnGoingRequests = {
    // "updata-telecom": {
    //     createdAt: new Date().getTime()
    // }
};

function RegisterOnGoingRequestBySessionName(sessionName) {
    OnGoingRequests[sessionName] = {
        createdAt: new Date().getTime()
    }
}

function DeleteOnGoingRequestBySessionName(sessionName) {
    delete OnGoingRequests[sessionName];
}

function GetOnGoingRequestBySessionName(sessionName) {
    return OnGoingRequests[sessionName] || null;
}

export {
    RegisterOnGoingRequestBySessionName,
    DeleteOnGoingRequestBySessionName,
    GetOnGoingRequestBySessionName,
}