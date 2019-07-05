const {match} = require('telegraf-i18n');

const Scene = require('telegraf/scenes/base');
const Stage = require('telegraf/stage');
const {enter, leave} = Stage;
const {Markup} = require('telegraf');
const keyboards = require('../../utils/keyboards');

const settingScene = new Scene('settingScene');

settingScene.enter(async (ctx) => {
    const {settingsKeyboard} = keyboards.getSettingsKeyboard(ctx);
    await ctx.reply(ctx.i18n.t('scenes.settings.question'), settingsKeyboard)
});

settingScene.hears(match('keyboards.settings.language'), async (ctx) => {
    const {languageKeyboard} = keyboards.getLanguageSelectKeyboard(ctx);
    await ctx.reply(ctx.i18n.t('scenes.settings.languageSelect'), languageKeyboard);
});

settingScene.leave(async(ctx)=>{
    const {mainKeyboard} = await keyboards.getMainKeyboard(ctx);
    await ctx.reply(ctx.i18n.t('scenes.main.question'), mainKeyboard);
});

settingScene.action('ruL', async (ctx) => {
    ctx.i18n.locale('ru');
    await ctx.telegram.editMessageText(ctx.chat.id, ctx.callbackQuery.message.message_id,
        undefined, ctx.i18n.t('scenes.settings.langSelect'));
    ctx.scene.leave();
});
settingScene.action('engL', async (ctx) => {
    ctx.i18n.locale('en');
    await ctx.telegram.editMessageText(ctx.chat.id, ctx.callbackQuery.message.message_id,
        undefined, ctx.i18n.t('scenes.settings.langSelect'));
    ctx.scene.leave();
});
settingScene.action('ukrL', async (ctx) => {
    ctx.i18n.locale('ukr');
    await ctx.telegram.editMessageText(ctx.chat.id, ctx.callbackQuery.message.message_id,
        undefined, ctx.i18n.t('scenes.settings.langSelect'));
    ctx.scene.leave();
});

module.exports = settingScene;