const WebSocket = require('ws');


const server = new WebSocket.Server({port: 8081});

server.on('connection', ws => {

    server.clients.forEach(client => {
        client.send(JSON.stringify([
            {userId: 432177996, infoText: 'Вас вызывают'},
            {userId: 255902751, infoText: 'Вас не вызывают'}

        ]));
    });

    ws.on('message', message => {

    });

    //ws.send('HELLO');
});
