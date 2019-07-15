const keyboards = require('./../../utils/keyboards');
const Scene = require('telegraf/scenes/base');
const {match} = require('telegraf-i18n');
const asyncWrapper = require('./../../utils/asyncWrapper');
const startWork = require('./../start/startFunc');

const mainScene = new Scene('mainScene');

mainScene.enter(async (ctx)=>{
    const {mainKeyboard} = keyboards.getMainKeyboard(ctx);
    await ctx.reply(ctx.i18n.t('scenes.main.question'), mainKeyboard);
});

mainScene.start(asyncWrapper(async (ctx) => {
   startWork(ctx);
}));

mainScene.hears(match('keyboards.main.talon'), asyncWrapper(async (ctx) => await ctx.scene.enter('talonScene')));

mainScene.hears(match('keyboards.main.reminds'), asyncWrapper(async (ctx) => {
    ctx.scene.enter('reminderScene');
}));

mainScene.hears(match('keyboards.main.updateInfo'), (ctx) => {
    ctx.reply('Ваша позиция: ' + 1 + '\nПримерное время ожидания: ' + 1);
});

mainScene.hears(match('keyboards.main.settings'), asyncWrapper(async (ctx) => {
    ctx.scene.enter('settingScene');
}));

mainScene.hears(match('keyboards.backButton'), asyncWrapper(async (ctx) => {
    const {mainKeyboard} = keyboards.getMainKeyboard(ctx);
    await ctx.reply(ctx.i18n.t('scenes.main.question'), mainKeyboard);
}));

mainScene.on('message', async (ctx) => {
    const {mainKeyboard} = keyboards.getMainKeyboard(ctx);
    await ctx.reply(ctx.i18n.t('help.randomInput'), mainKeyboard);
});

module.exports = mainScene;