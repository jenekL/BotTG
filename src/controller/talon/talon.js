const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const {enter, leave} = Stage;
const {Markup} = require('telegraf');
const keyboards = require('../../utils/keyboards');
const {delUserByID, addUser, getTalonByID} = require('../../database/database');
const talonScene = new Scene('talonScene');
const {match} = require('telegraf-i18n');
const asyncWrapper = require('./../../utils/asyncWrapper');
const startWork = require('./../start/startFunc');

let newTalon = false;

talonScene.enter(async (ctx) => {
    const {talonKeyboard} = keyboards.getTalonKeyboard(ctx);
    await ctx.reply(ctx.i18n.t('scenes.talon.question'), talonKeyboard);
});

talonScene.start(asyncWrapper(async (ctx) => {
    startWork(ctx);
}));

talonScene.hears(match('keyboards.backButton'), async (ctx) => {
    ctx.scene.enter('mainScene');
});

talonScene.hears(match('keyboards.talon.begin'), async (ctx) => {
    const beginKeyboard = Markup.keyboard([
        [ctx.i18n.t('keyboards.newTalon.exist')],
        [ctx.i18n.t('keyboards.newTalon.new')],
        [ctx.i18n.t('keyboards.newTalon.back')]
    ])
        .resize()
        .extra();
    await ctx.reply(ctx.i18n.t('scenes.talon.question'), beginKeyboard);
});

talonScene.hears(match('keyboards.newTalon.back'), async (ctx) =>{
    newTalon = false;
    const {talonKeyboard} = keyboards.getTalonKeyboard(ctx);
    await ctx.reply(ctx.i18n.t('scenes.talon.question'), talonKeyboard);
});

//отправить на сервер запрос с завершением
talonScene.hears(match('keyboards.talon.end'), async (ctx) => {
    delUserByID(ctx.from.id);
    await ctx.scene.enter('startScene');
});

// продолжить шото
talonScene.hears(match('keyboards.newTalon.exist'), (ctx) => {

});

//регистрация нового талоно(отдельная функция скорее всего)
talonScene.hears(match('keyboards.newTalon.new'), (ctx) => {
    newTalon = true;
    ctx.reply(ctx.i18n.t('scenes.start.newTalon'));
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