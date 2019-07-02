const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const {enter, leave} = Stage;
const {Markup} = require('telegraf');
const keyboards = require('../../utils/keyboards');
const {delUserByID, addUser, getTalonByID} = require('../../database/database');
const talonScene = new Scene('talonScene');

let newTalon = false;

talonScene.enter(async (ctx) => {
    const {talonKeyboard} = keyboards.getTalonKeyboard(ctx);
    await ctx.reply('Выберите действие: ', talonKeyboard);
});

talonScene.leave();

talonScene.hears('Назад', async (ctx) => {
    ctx.scene.leave();
    const {mainKeyboard} = await keyboards.getMainKeyboard(ctx);
    await ctx.reply('Что узнать:', mainKeyboard);
});


talonScene.hears(/Начать/, async (ctx) => {
    const beginKeyboard = Markup.keyboard([
        ['Продолжить отслеживание существующего талона(????)'],
        ['Отслеживать новый талон'],
        ['Вернуться']
    ])
        .resize()
        .extra();
    await ctx.reply('Что узнать:', beginKeyboard);
});

talonScene.hears('Вернуться', async (ctx) =>{
    newTalon = false;
    const {talonKeyboard} = keyboards.getTalonKeyboard(ctx);
    await ctx.reply('Выберите действие: ', talonKeyboard);
});

//отправить на сервер запрос с завершением
talonScene.hears(/Завершить/, async (ctx) => {
    delUserByID(ctx.from.id);
    await ctx.scene.enter('startScene');
});

// продолжить шото
talonScene.hears('Продолжить отслеживание существующего талона', (ctx) => {

});

//регистрация нового талоно(отдельная функция скорее всего)
talonScene.hears('Отслеживать новый талон', (ctx) => {
    newTalon = true;
    ctx.reply('Введите номер талона');
});

talonScene.on('message', async (ctx)=>{
    if(newTalon){
        //проверка на талон
        delUserByID(ctx.from.id);
        await addUser({
            id: ctx.from.id,
            sourceName: 'telegram',
            talonID: Number(ctx.message.text)
        });
        newTalon = false;
    }
});

module.exports = talonScene;