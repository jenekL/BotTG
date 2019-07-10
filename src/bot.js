const Telegraf = require('telegraf');
const TelegrafI18n = require('telegraf-i18n');
const {match} = require('telegraf-i18n');

const session = require('telegraf/session');
const Stage = require('telegraf/stage');
//const Scene = require('telegraf/scenes/base');
const asyncWrapper = require('./utils/asyncWrapper');
const keyboards = require('./utils/keyboards');
const path = require('path');
require('./utils/arrayContains');
const XMLparseString = require('xml2js').parseString;
const database = require('./database/database');
const now = require('./utils/timeConvert');
const {ws, connect} = require('./ws/websocket');

const TOKEN = '797482196:AAHpZnnt4TmXo_394dik-HJ259jz5cFRuCE';
const RECONNECTION_TIME = 60 * 1000; // 60 sec

const startScene = require('./controller/start/startScene');
const reminderScene = require('./controller/reminds/reminders');
const talonScene = require('./controller/talon/talon');
const settingScene = require('./controller/settings/settingScene');
const languageScene = require('./controller/start/languageScene');



//TODO webhook
const bot = new Telegraf(TOKEN);

const i18n = new TelegrafI18n({
    defaultLanguage: 'ru',
    directory: path.resolve(__dirname, 'locales'),
    useSession: true,
    allowMissing: false,
    sessionName: 'session'
});
//bot.use(Telegraf.log());

const stage = new Stage(
    [reminderScene.reminderScene, talonScene, startScene, settingScene, languageScene.languageScene]);
//{ttl: 10});
bot.use(session());
bot.use(i18n.middleware());
bot.use(stage.middleware());

//ctx.scene.enter('startWizardScene');
bot.start(asyncWrapper(async (ctx) => {

    //database.delUserByID(ctx.from.id);

    let payload = ctx.startPayload;
    if (payload !== '' && payload !== undefined) {      //если написано /start код_талона
        console.log('start ID:', ctx.from.first_name + ' ', ctx.from.id, ' payload:' + payload);
        //проверка на валидность пейлоада
        if (payload !== '123' && payload !== '456') {
            ctx.reply(ctx.i18n.t('scenes.start.notExistPayload'));
            // ctx.scene.enter('startScene');
            languageScene.setValid(true);
            ctx.scene.enter('languageScene');
        } else {

            database.addUser({
                id: ctx.from.id,
                source: 'telegram',
                coupon: Number(payload)
            });

            let data = '<request_type>' +
                '<row request_type="TrackClient" equery_num="' + payload + '" login="oper1" session="blahblah" />' +
                '</request_type>';

            ws.send('<' + now('micro') + ',' + Buffer.byteLength(data, 'utf8')
                + ',add_track_client>\n' + data);

            ctx.scene.enter('languageScene');
        }
    } else { // если написано /start
        console.log('start without payload ID:', ctx.from.first_name + ' ', ctx.from.id, ' payload:' + payload);
        languageScene.setValid(true);
        //ctx.scene.enter('startScene');
        ctx.scene.enter('languageScene');
    }
}));

bot.hears(match('keyboards.main.talon'), asyncWrapper(async (ctx) => await ctx.scene.enter('talonScene')));

bot.hears(match('keyboards.main.reminds'), asyncWrapper(async (ctx) => {
    ctx.scene.enter('reminderScene');
}));

bot.hears(match('keyboards.main.updateInfo'), (ctx) => {
    ctx.reply('Ваша позиция: ' + 1 + '\nПримерное время ожидания: ' + 1);
});

bot.hears(match('keyboards.main.settings'), asyncWrapper(async (ctx) => {
    ctx.scene.enter('settingScene');
}));

bot.hears(match('keyboards.backButton'), asyncWrapper(async (ctx) => {
    const {mainKeyboard} = keyboards.getMainKeyboard(ctx);
    await ctx.reply(ctx.i18n.t('scenes.main.question'), mainKeyboard);
}));

bot.help((ctx) => {
    ctx.reply(ctx.i18n.t('help.text'))
});

bot.on('message', async (ctx) => {
    const {mainKeyboard} = keyboards.getMainKeyboard(ctx);
    await ctx.reply(ctx.i18n.t('help.randomInput'), mainKeyboard);
});

//bot.startPolling();
connect();
bot.launch();
//{
//     webhook:{
//
//         port:3000
//     }
// }




