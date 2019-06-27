//var TelegramBot = require('node-telegram-bot-api');
const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const WizardScene = require('telegraf/scenes/wizard');
const {enter, leave} = Stage;
const asyncWrapper = require('./utils/asyncWrapper');
const arrayContsins = require('./utils/arrayContains');
const keyboards = require('./utils/keyboards');

const WebSocket = require('ws');
let ws;

// Устанавливаем токен, который выдавал нам бот.
const token = '797482196:AAHpZnnt4TmXo_394dik-HJ259jz5cFRuCE';


const mainScene = require('./controller/main/mainScene');
const reminderScene = require('./controller/reminds/reminds');
const addRemindScene = require('./controller/reminds/addReminds');
const delRemindScene = require('./controller/reminds/deleteRemindScene');
const talonScene = require('./controller/talon/talon');

//TODO to separate file
Array.prototype.contains = function (element) {
    return this.indexOf(element) > -1;
};


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
        setTimeout(connect, 60000); //6 secs
    });
    //TODO xml parse
    ws.onmessage = async response => {
        const params = JSON.parse(response.data);
        await params.forEach((param) => {
            bot.telegram.sendMessage(param.userId, param.infoText);
        });
    };
};

//TODO Переменные окружения
const bot = new Telegraf(token);

//bot.use(Telegraf.log());

const stage = new Stage(
    [addRemindScene.addRemindScene, mainScene.mainScene,
        reminderScene.reminderScene, delRemindScene.delRemindScene, talonScene],
    {ttl: 10});
bot.use(session());
bot.use(stage.middleware());

bot.start(asyncWrapper(async (ctx) => {
    console.log("start ID:", ctx.from.first_name + " ", ctx.from.id);
    //ctx.scene.enter('mainScene');
    const {mainKeyboard} = keyboards.getMainKeyboard(ctx);
    await ctx.reply('Что узнать:', mainKeyboard);
}));

bot.hears('Талон', asyncWrapper(async (ctx) => await ctx.scene.enter('talonScene')));

bot.hears('Напоминания', asyncWrapper( async (ctx) => {
    ctx.scene.enter('reminderScene')
}));

bot.hears('Позиция', (ctx) => {
    ctx.reply('Ваша позиция: ' + 1 + '\nПримерное время ожидания: ' + 1);
});

bot.hears('Назад', asyncWrapper(async (ctx) => {
    const {mainKeyboard} = keyboards.getMainKeyboard(ctx);
    await ctx.reply('Что узнать:', mainKeyboard);
}));

bot.hears('Another', (ctx) => {
    console.log(ctx.from.id + ' ' + ctx.from.first_name);
    ctx.reply('123');
    ctx.reply('4');
    ctx.reply('5');
    ctx.reply('6');
});

bot.help((ctx) => {
    ctx.reply('Попробуйте написать /start ;)')
});


//@Deprecate
//bot.on('message', (ctx => ctx.reply(ctx.message.text)));

//bot.startPolling();
connect();
bot.launch();




