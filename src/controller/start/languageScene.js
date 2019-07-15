const keyboards = require('./../../utils/keyboards');
const Scene = require('telegraf/scenes/base');
const {Markup} = require('telegraf');

let notValidToken = false;

const languageScene = new Scene('languageScene');
languageScene.enter(async (ctx) => {
    const {languageKeyboard} = keyboards.getLanguageSelectKeyboard(ctx);
    await ctx.reply(ctx.i18n.t('scenes.settings.languageSelect'), languageKeyboard);
});

languageScene.action('ruL', async (ctx) => {
    ctx.i18n.locale('ru');
    setLang(ctx);
});
languageScene.action('engL', async (ctx) => {
    ctx.i18n.locale('en');
    setLang(ctx);
});
languageScene.action('ukrL', async (ctx) => {
    ctx.i18n.locale('ukr');
    setLang(ctx);
});

async function setLang(ctx) {
    await ctx.telegram.editMessageText(ctx.chat.id, ctx.callbackQuery.message.message_id,
        undefined, ctx.i18n.t('scenes.settings.langSelect'));

    if (notValidToken) {
        notValidToken = false;
        ctx.scene.enter('startScene');
    } else {
        ctx.scene.enter('mainScene');
    }
}

languageScene.on('message', async (ctx) => {
    ctx.reply(ctx.i18n.t('scenes.settings.languageSelect'));
});

function setNotValid(value) {
    notValidToken = value;
}

module.exports = {languageScene, setNotValid: setNotValid};


