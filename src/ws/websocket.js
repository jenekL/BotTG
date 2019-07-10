const WebSocket = require('ws');
const now = require('./../utils/timeConvert');

const ws = new WebSocket('ws://localhost:8081');
const connect = async () => {
    //ws = new WebSocket('ws://equery.cherg.net:64666');

    const authorizationStr = '<request_type><row request_type="bot_reg" id="TelegClientBot"/></request_type>';

    ws.on('open', async () => {
        //<microtime,len,authorization>
        ws.send('<' + now('micro') + ',' + Buffer.byteLength(authorizationStr, 'utf8')
            + ',authorization>\n' + authorizationStr);

        console.log('connection opened');
    });
    ws.on('error', async () => {
        console.log('error connection');
    });
    ws.on('close', async () => {
        console.log('connection closed');
        setTimeout(connect, RECONNECTION_TIME);
    });

    //TODO реализовать
    ws.onmessage = async response => {
        console.log(response.data);
        // const params = XMLparseString(response.data, (err, result) => {
        //     if (result !== undefined) {
        //         console.dir(result);
        //         console.dir(result.root);
        //     } else {
        //         console.dir(err);
        //     }
        //
        // });

        // const params = JSON.parse(response.data);
        // await params.forEach((param) => {
        //     bot.telegram.sendMessage(param.userId, param.infoText);
        // });
    };

};

module.exports = {connect,ws};