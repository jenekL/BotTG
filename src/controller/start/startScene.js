const {match} = require('telegraf-i18n');
const Scene = require('telegraf/scenes/base');
const Stage = require('telegraf/stage');
const {enter, leave} = Stage;
const {Markup} = require('telegraf');
const keyboards = require('../../utils/keyboards');
const database = require('../../database/database');
const {ws} = require('./../../ws/websocket');
const now = require('./../../utils/timeConvert');

const startScene = new Scene('startScene');

startScene.enter(async (ctx)=>{
    ctx.reply(ctx.i18n.t('scenes.start.newTalon'), Markup.removeKeyboard().extra());
});

startScene.on('message', async (ctx)=>{
    ctx.reply(ctx.message.text);
    //TODO проверка
    if(ctx.message.text === '123'){
        //ctx.reply('Готово!');
        database.addUser({
            id: ctx.from.id,
            source: 'telegram',
            coupon: Number(ctx.message.text)
        });

        let data = '<request_type>' +
            '<row request_type="TrackClient" equery_num="' + ctx.message.text + '" login="oper1" session="blahblah" />' +
            '</request_type>';

        ws.send('<' + now('micro') + ',' + Buffer.byteLength(data, 'utf8')
            + ',add_track_client>\n' + data);

        const {mainKeyboard} = await keyboards.getMainKeyboard(ctx);
        await ctx.reply(ctx.i18n.t('scenes.main.question'), mainKeyboard);
        await ctx.scene.leave();
    }
    else{
        ctx.reply(ctx.i18n.t('scenes.start.talonNotExist'));
    }
});


module.exports = startScene;