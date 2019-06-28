const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const {enter, leave} = Stage;
const {Markup} = require('telegraf');
const keyboards = require('../../utils/keyboards');

const talonScene = new Scene('talonScene');


talonScene.enter(async (ctx) => {
    const {talonKeyboard} = keyboards.getTalonKeyboard(ctx);
    await ctx.reply('?', talonKeyboard);
});

talonScene.leave();

talonScene.hears('Назад', async (ctx) => {
    leave();
    const {mainKeyboard} = keyboards.getMainKeyboard(ctx);
    await ctx.reply('Что узнать:', mainKeyboard);
});


talonScene.hears(/Начать/, async (ctx) => {
    const beginKeyboard = Markup.keyboard([
        ['Продолжить отслеживание существующего талона'],
        ['Отслеживать новый талон'],
        ['Вернуться']
    ])
        .resize()
        .extra();
    await ctx.reply('Что узнать:', beginKeyboard);
});

talonScene.hears('Вернуться', async (ctx) =>{
    const {talonKeyboard} = keyboards.getTalonKeyboard(ctx);
    await ctx.reply('?', talonKeyboard);
});

//отправить на сервер запрос с завершением
talonScene.hears(/Завершить/, (ctx) => {

});

// продолжить шото
talonScene.hears('Продолжить отслеживание существующего талона', (ctx) => {

});

//регистрация нового талоно(отдельная функция скорее всего)
talonScene.hears('Отслеживать новый талон', (ctx) => {

});

module.exports = talonScene;