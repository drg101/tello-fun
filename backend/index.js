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

class TelloControl {
    constructor() {
        this.PORT = 8889;
        this.HOST = '192.168.10.1';
        this.client = dgram.createSocket('udp4');
        this.client.bind(8001);
        this.client.on('message', (msg, info) => {
            console.log('Data received from drone : ' + msg.toString());
        });
        this.client.on('listening', () => {
            this.sendMessage('command')
        });
    }

    sendMessage(commandStr) {
        console.log(`Command: ${commandStr}`);
        if (commandStr === 'KILL') {
            this.close();
            telloState.kill();
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

class TelloState {
    constructor() {
        this.client = dgram.createSocket('udp4');
        this.client.bind(8890);
        this.client.on('error', (err) => {
            console.log(`server error:\n${err.stack}`);
            server.close();
        });

        this.client.on('message', (msg, rinfo) => {
            console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
        });

        this.client.on('listening', () => {
            const address = this.client.address();
            console.log(`server listening ${address.address}:${address.port}`);
        });
        // this.client.on('message', (msg, info) => {
        //     console.log('state received from drone : ' + msg.toString());
        // });
    }

    kill() {
        this.client.close();
    }
}

const telloDroneControl = new TelloControl();
let telloState;
setTimeout(() => {
    telloState = new TelloState();
}, 5000)

io.on('connection', client => {
    console.log("CLIENT CONNECTED")
    client.on('telloControl', data => {
        telloDroneControl.sendMessage(data)
    })
    client.on('disconnect', () => {
        console.log("CLIENT DISCONECTED")
        //telloDrone.close();
    });
});





