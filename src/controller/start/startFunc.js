const languageScene = require('./languageScene');
const {addData} = require('./../../utils/responseHandler');
const {ws} = require('./../../ws/websocket');

function startWork(ctx) {
    //database.delUserByID(ctx.from.id);

    let payload = ctx.startPayload;
    if (payload !== '' && payload !== undefined && !isNaN(payload)) {      //если написано /start код_талона
        console.log('start ID:', ctx.from.first_name + ' ', ctx.from.id, ' payload:' + payload);

        const time = now('micro');
        let data = '<request_type>' +
            '<row request_type="TrackClient" equery_num="' + payload + '" login="oper1" session="blahblah" />' +
            '</request_type>';

        ws.send('<' + time + ',' + Buffer.byteLength(data, 'utf8')
            + ',add_track_client>\n' + data);


        addData([{
                time: time,
                coupon: payload,
                id: ctx.from.id,
                context: ctx,
                payload: true
            }]
        );


    } else { // если написано /start
        console.log('start without payload ID:', ctx.from.first_name + ' ', ctx.from.id, ' payload:' + payload);
        languageScene.setNotValid(true);
        //ctx.scene.enter('startScene');
        ctx.scene.enter('languageScene');
    }
}

module.exports = startWork;