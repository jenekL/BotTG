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

// Устанавливаем токен, который выдавал нам бот.
const TOKEN = '797482196:AAHpZnnt4TmXo_394dik-HJ259jz5cFRuCE';
const RECONNECTION_TIME = 60 * 1000; // 60 sec

const startScene = require('./controller/start/startScene');
const reminderScene = require('./controller/reminds/reminds');
const addRemindScene = require('./controller/reminds/addReminds');
const delRemindScene = require('./controller/reminds/deleteRemindScene');
const talonScene = require('./controller/talon/talon');


/*const create = new WizardScene(
    "reminds", // Имя сцены
    function (ctx) {
        ctx.reply("Выберите:", Markup.keyboard([
            Markup.callbackButton("Создать напоминание", "createRemind"),
            Markup.callbackButton("Очистить напоминания", "clearRemind"),
            Markup.callbackButton("Назад", "Назад")
        ]).extra());
        if (ctx.message.text === "Назад") {
            ctx.wizard.back();
        }
        return ctx.wizard.next(); // Переходим к следующему обработчику.
    },
    function (ctx) {
        ctx.reply('Этап 2: выбор времени проведения матча.');
        return ctx.wizard.next(); // Переходим к следующему обработчику.
    },
    function (ctx) {
        if (ctx.message.text === "Назад") {
            ctx.wizard.back(); // Вернуться к предыдущиму обработчику
        }
        ctx.reply('Этап 3: выбор места проведения матча.');
        return ctx.wizard.next(); // Переходим к следующему обработчику.
    },
    function (ctx) {
        ctx.reply('Финальный этап: создание матча.');
        return ctx.scene.leave();
    }
);

const stage = new Stage();

stage.register(create);
*/

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

//TODO Переменные окружения
const bot = new Telegraf(TOKEN);

//bot.use(Telegraf.log());

const stage = new Stage(
    [addRemindScene.addRemindScene, reminderScene.reminderScene, delRemindScene.delRemindScene, talonScene, startScene],
    {ttl: 10});
bot.use(session());
bot.use(stage.middleware());

bot.start(asyncWrapper(async (ctx) => {
    let payload = ctx.startPayload;
    if(payload !== ''){
        console.log('start ID:', ctx.from.first_name + ' ', ctx.from.id, ' payload:' + payload);
        //проверка на валидность пейлоада
        if(payload === '123'){
            ctx.reply('Талон не существует.');
            ctx.scene.enter('startScene');
        }
        else{
            ctx.reply('Добро пожаловать!');
            const {mainKeyboard} = keyboards.getMainKeyboard(ctx);
            await ctx.reply('Что узнать:', mainKeyboard);
        }
    }
    else{
        console.log('start without payload ID:', ctx.from.first_name + ' ', ctx.from.id, ' payload:' + payload);
        ctx.scene.enter('startScene');
    }
}));

bot.hears('Талон', asyncWrapper(async (ctx) => await ctx.scene.enter('talonScene')));

bot.hears('Напоминания', asyncWrapper(async (ctx) => {
    ctx.scene.enter('reminderScene')
}));

bot.hears('Позиция', (ctx) => {
    ctx.reply('Ваша позиция: ' + 1 + '\nПримерное время ожидания: ' + 1);
});

bot.hears('Назад', asyncWrapper(async (ctx) => {
    const {mainKeyboard} = keyboards.getMainKeyboard(ctx);
    await ctx.reply('Что узнать:', mainKeyboard);
}));

bot.hears('Another', async (ctx) => {
    console.log(ctx.from.id + ' ' + ctx.from.first_name);
    await ctx.reply('123');
    await ctx.reply('4');
    await ctx.reply('5');
    await ctx.reply('6');
});

bot.help((ctx) => {
    ctx.reply('Попробуйте написать /start ;)')
});

//bot.startPolling();
connect();
bot.launch();




