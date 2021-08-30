const server = require('http').createServer();
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});
const dgram = require('dgram');

const socketPort = 8080;
server.listen(socketPort, () => {
    console.log(`SERVER LISTENING ON ${socketPort}`)
});

class Tello {
    constructor() {
        this.PORT = 8889;
        this.HOST = '192.168.10.1';
        this.client = dgram.createSocket('udp4');
        this.client.bind(8001);
        this.client.on('message', (msg, info) => {
            console.log('Data received from drone : ' + msg.toString());
        });
    }

    sendMessage(commandStr) {
        console.log(`Command: ${commandStr}`);
        if(commandStr === 'KILL') {
            this.close();
            throw 'killed by client'
            return;
        }
        this.client.send(commandStr, 0, commandStr.length, this.PORT, this.HOST, function (err, bytes) {
            if (err) throw err;
        });
    }

    close() {
        this.client.close();
    }
}

//const telloDrone = new Tello();

io.on('connection', client => {
    console.log("CLIENT CONNECTED")
    client.on('telloControl', data => {
        telloDrone.sendMessage(data)
    })
    client.on('disconnect', () => {
        console.log("CLIENT DISCONECTED")
        //telloDrone.close();
    });
});





