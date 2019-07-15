const WebSocket = require('ws');
const now = require('./../utils/timeConvert');
const XMLparseString = require('xml2js').parseString;
const responseHandler = require('./../utils/responseHandler');

const RECONNECTION_TIME = 10 * 1000; // 10 sec

let ws = new WebSocket('ws://localhost:8081');
//let ws = new WebSocket('ws://equery.cherg.net:64666');

const connect = async () => {

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

    ws.onmessage = async response => {

        console.log(response.data);
        try {
            const head = response.data.substring(1, response.data.indexOf('>')).split(',');
            console.log(head);
            const body = response.data.substring(response.data.indexOf('>') + 1);
            const params = XMLparseString(body, (err, result) => {
                    if (result !== undefined) {
                        console.dir(result);
                       // console.dir(result.response['status-code']);

                        //TODO later maybe switch
                        if (head[2] === 'add_track_client') {
                            responseHandler.resultResponse(result.response['status-code'][0], head[0]);
                        }

                    } else {
                        console.dir(err);
                    }

                }
            );


        } catch (error) {
            console.log(error);
        }


        // const params = JSON.parse(response.data);
        // await params.forEach((param) => {
        //     bot.telegram.sendMessage(param.userId, param.infoText);
        // });
    };

};



module.exports = {connect, ws};