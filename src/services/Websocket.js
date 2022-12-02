import socketio from 'socket.io';
import { DeleteOnGoingRequestBySessionName, GetOnGoingRequestBySessionName } from './RequestMonitor';
import { SaveSession } from './SessionStore';
import { start } from './VenomStarter';

class Websocket {
    constructor() { }

    start(server) {
        const io = socketio(server, { cors: { origin: '*' } });

        io.on("connection", async socket => {
            const { sessionName } = socket.handshake.query;
            const request = GetOnGoingRequestBySessionName(sessionName);
            if (request) {
                socket.emit(
                    "on-going-qr-code-generation-detected",
                    { createdAt: request.createdAt }
                );
                socket.disconnect();
            }
            socket.emit("qr-code-generation-starting");
            try {
                const venomSession = await start({
                    sessionName,
                    callback: (base64Qrimg) => {
                        socket.emit("qr-code-ready", {
                            qrcode: base64Qrimg,
                        });
                    }
                });
                SaveSession(venomSession, sessionName);
                DeleteOnGoingRequestBySessionName(sessionName);
                socket.emit("qr-code-successfully-read");
                socket.disconnect();
            } catch (error) {
                socket.emit("qr-code-generation-expired")
                DeleteOnGoingRequestBySessionName(sessionName);
                socket.disconnect();
            }
        });
    }
}

export default new Websocket();