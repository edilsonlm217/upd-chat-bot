import socketio from 'socket.io';
import { startVenomSession } from './Venom';
import { registerWhatsappAgent } from './WhatsappAgent';

class Websocket {
    constructor() { }

    start(server) {
        const io = socketio(server, { cors: { origin: '*' } });
        
        io.on("connection", async socket => {
            const { client } = socket.handshake.query;
            socket.emit("successfully-connected");
            socket.emit("qr-code-generation-started");
            try {
                const venomSession = await startVenomSession({
                    client: client,
                    callback: (base64Qrimg) => {
                        socket.emit("qr-code-generation-done", {
                            qrcode: base64Qrimg,
                        });
                    }
                });
                registerWhatsappAgent(venomSession, client);
            } catch (error) {
                console.log(error);
            }
            socket.disconnect();
        });
    }

}

export default new Websocket();