const Telegraf = require('telegraf');
const TelegrafI18n = require('telegraf-i18n');
const {match} = require('telegraf-i18n');

const session = require('telegraf/session');
const Stage = require('telegraf/stage');
//const Scene = require('telegraf/scenes/base');
const {enter, leave} = Stage;
const asyncWrapper = require('./utils/asyncWrapper');
const keyboards = require('./utils/keyboards');
const path = require('path');
require('./utils/arrayContains');
const XMLparseString = require('xml2js').parseString;
const WebSocket = require('ws');
const database = require('./database/database');

const TOKEN = '797482196:AAHpZnnt4TmXo_394dik-HJ259jz5cFRuCE';
const RECONNECTION_TIME = 60 * 1000; // 60 sec

const startScene = require('./controller/start/startScene');
const reminderScene = require('./controller/reminds/reminds');
const addRemindScene = require('./controller/reminds/addReminds');
const delRemindScene = require('./controller/reminds/deleteRemindScene');
const talonScene = require('./controller/talon/talon');
const settingScene = require('./controller/settings/settingScene');


let ws;
const connect = async () => {
    ws = new WebSocket('ws://94.250.252.210:64666');
    //ws = new WebSocket('ws://localhost:3000');
    ws.on('open', async () => {
        ws.send('<request_type><row request_type="bot_reg" id="TelegClientBot"/></request_type>');
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
    [addRemindScene.addRemindScene, reminderScene.reminderScene,
        delRemindScene.delRemindScene, talonScene, startScene, settingScene]);
//{ttl: 10});
bot.use(session());
bot.use(i18n.middleware());
bot.use(stage.middleware());

bot.start(asyncWrapper(async (ctx) => {
    let payload = ctx.startPayload;
    if (payload !== '') {      //если написано /start код_талона
        console.log('start ID:', ctx.from.first_name + ' ', ctx.from.id, ' payload:' + payload);
        //проверка на валидность пейлоада
        if (payload !== '123' && payload !== '456') {
            ctx.reply('Талон не существует.');
            ctx.scene.enter('startScene');
        } else {
            ctx.reply('Добро пожаловать!');

            database.addUser({
                id: ctx.from.id,
                sourceName: 'telegram',
                talonID: Number(payload)
            });

            const {mainKeyboard} = keyboards.getMainKeyboard(ctx);
            await ctx.reply('Что узнать:', mainKeyboard);
        }
    } else { // если написано /start
        console.log('start without payload ID:', ctx.from.first_name + ' ', ctx.from.id, ' payload:' + payload);
        ctx.scene.enter('startScene');
    }
}));

bot.hears('Талон', asyncWrapper(async (ctx) => await ctx.scene.enter('talonScene')));

bot.hears('Напоминания', asyncWrapper(async (ctx) => {
    ctx.scene.enter('reminderScene');
}));

bot.hears('Обновить информацию', (ctx) => {
    ctx.reply('Ваша позиция: ' + 1 + '\nПримерное время ожидания: ' + 1);
});

bot.hears(match('keyboards.main.settings'), asyncWrapper(async (ctx) => {
    ctx.scene.enter('settingScene');
}));

bot.hears('Назад', asyncWrapper(async (ctx) => {
    const {mainKeyboard} = keyboards.getMainKeyboard(ctx);
    await ctx.reply('Что узнать:', mainKeyboard);
}));

bot.help((ctx) => {
    ctx.reply('Попробуйте написать /start ;)')
});

bot.on('message', async (ctx) => {
    const {mainKeyboard} = keyboards.getMainKeyboard(ctx);
    await ctx.reply('Выберите необходимое действие в меню!', mainKeyboard);
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



