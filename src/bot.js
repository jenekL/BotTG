//var TelegramBot = require('node-telegram-bot-api');
const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
//const Scene = require('telegraf/scenes/base');
const {enter, leave} = Stage;
const asyncWrapper = require('./utils/asyncWrapper');
const keyboards = require('./utils/keyboards');
require('./utils/arrayContains');
const XMLparseString = require('xml2js').parseString;
const WebSocket = require('ws');
const database = require('./database/database');

// Устанавливаем токен, который выдавал нам бот.
const TOKEN = '797482196:AAHpZnnt4TmXo_394dik-HJ259jz5cFRuCE';
const RECONNECTION_TIME = 60 * 1000; // 60 sec

const startScene = require('./controller/start/startScene');
const reminderScene = require('./controller/reminds/reminds');
const addRemindScene = require('./controller/reminds/addReminds');
const delRemindScene = require('./controller/reminds/deleteRemindScene');
const talonScene = require('./controller/talon/talon');


let ws;
const connect = async () => {
    ws = new WebSocket('ws://localhost:8081');
    ws.on('open', async () => {
        console.log('connection opened');
    });
    ws.on('error', async () => {
        console.log('error connection');
    });
    ws.on('close', async () => {
        console.log('connection closed');
        setTimeout(connect, RECONNECTION_TIME);
    });

    //TODO при соотв сообщении удалять, проверять по номеру талона...
    ws.onmessage = async response => {
        const params = XMLparseString(response.data, (err, result) => {
            if (result !== undefined) {
                console.dir(result);
                console.dir(result.root);
            } else {
                console.dir(err);
            }

        });

        // const params = JSON.parse(response.data);
        // await params.forEach((param) => {
        //     bot.telegram.sendMessage(param.userId, param.infoText);
        // });
    };
};

//TODO webhook
const bot = new Telegraf(TOKEN);

//bot.use(Telegraf.log());

const stage = new Stage(
    [addRemindScene.addRemindScene, reminderScene.reminderScene, delRemindScene.delRemindScene, talonScene, startScene]);
//{ttl: 10});
bot.use(session());
bot.use(stage.middleware());

//TODO если написали старт и уже есть в отслеживании - удалить
bot.start(asyncWrapper(async (ctx) => {
    let payload = ctx.startPayload;
    //если написано /start код_талона
    if (payload !== '') {
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
    ctx.scene.enter('reminderScene')
}));

bot.hears('Обновить информацию', (ctx) => {
    ctx.reply('Ваша позиция: ' + 1 + '\nПримерное время ожидания: ' + 1);
});

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



