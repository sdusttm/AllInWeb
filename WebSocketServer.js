module.exports.run = () => {
    const WsServer = require('ws').Server;

    const wss = new WsServer({port:8080});
    wss.on('connection', function(ws) {
        console.log('client connected');
        ws.on('message', function(ms) {
            console.log(ms);
            wss.clients.forEach(client => {
                client.send(ms)
            });
            // ws.send("from server: " + ms)
        })

        ws.on('close', () => {
            console.log('connection closed')
        })

        ws.on('error', () => {
            console.log('error')
        })
    })

    console.log('wss server started');   
}