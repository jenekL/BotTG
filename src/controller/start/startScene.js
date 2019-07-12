const {match} = require('telegraf-i18n');
const Scene = require('telegraf/scenes/base');
const Stage = require('telegraf/stage');
const {enter, leave} = Stage;
const {Markup} = require('telegraf');
const keyboards = require('../../utils/keyboards');
const database = require('../../database/database');
const {ws} = require('./../../ws/websocket');
const now = require('./../../utils/timeConvert');
const {addData} = require('./../../utils/responseHandler');

const startScene = new Scene('startScene');

startScene.enter(async (ctx) => {
    ctx.reply(ctx.i18n.t('scenes.start.newTalon'), Markup.removeKeyboard().extra());
});

startScene.on('message', async (ctx) => {
    //ctx.reply(ctx.message.text);

    if (!isNaN(ctx.message.text)) {
        //ctx.reply('Готово!');

        let data = '<request_type>' +
            '<row request_type="TrackClient" equery_num="' + ctx.message.text + '" login="oper1" session="blahblah" />' +
            '</request_type>';

        const time = now('micro');

        ws.send('<' + time + ',' + Buffer.byteLength(data, 'utf8')
            + ',add_track_client>\n' + data);

        addData([{
                time: time,
                coupon: ctx.message.text,
                id: ctx.from.id,
                context: ctx,
                payload: false
            }]
        )
    } else {
        ctx.reply(ctx.i18n.t('scenes.start.talonNotExist'));
    }
});


module.exports = startScene;