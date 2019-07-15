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
const database = require('./database/database');
const now = require('./utils/timeConvert');
const {ws, connect} = require('./ws/websocket');
const {addData} = require('./utils/responseHandler');
const startWork = require('./controller/start/startFunc');

const TOKEN = '797482196:AAHpZnnt4TmXo_394dik-HJ259jz5cFRuCE';

const startScene = require('./controller/start/startScene');
const reminderScene = require('./controller/reminds/reminders');
const talonScene = require('./controller/talon/talon');
const settingScene = require('./controller/settings/settingScene');
const languageScene = require('./controller/start/languageScene');
const mainScene = require('./controller/main/mainScene');



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
    [reminderScene.reminderScene, talonScene, startScene, settingScene, languageScene.languageScene, mainScene]);
//{ttl: 10});
bot.use(session());
bot.use(i18n.middleware());
bot.use(stage.middleware());

bot.start(asyncWrapper(async (ctx) => {
    startWork(ctx);
}));

bot.help(async (ctx) => {
    ctx.reply(ctx.i18n.t('help.text'))
});

bot.on('message',  async (ctx) => {

    //not for test
    let active = await database.getActive(ctx.from.id);

    if(active){
        ctx.scene.enter('mainScene');
    }
    else{
        ctx.scene.enter('startScene');
    }

    //for test
    //ctx.scene.enter('startScene');

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

