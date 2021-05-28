import socketio from 'socket.io';

export default new function Websocket() {
  var io = null;
  var connections = {};

  function constructor() { }

  function init(server) {
    io = socketio(server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    io.on("connection", socket => {
      connections[socket.id] = socket;
      console.log(socket.id);
    });
  }

  const WebsocketPrototype = {
    io: io,
    connections: connections,
    init: (server) => { init(server); }
  }

  constructor.prototype = WebsocketPrototype;

  let instance = new constructor();
  return instance;
}