const {Markup} = require('telegraf');

const getRemindsKeyboard = (ctx) => {
    const remindsKeyboardAll = ctx.i18n.t('keyboards.reminds.all');
    const remindsKeyboardAdd = ctx.i18n.t('keyboards.reminds.add');
    const remindsKeyboardDel = ctx.i18n.t('keyboards.reminds.del');
    const remindsKeyboardBack = ctx.i18n.t('keyboards.backButton');
    let remindsKeyboard = Markup.keyboard([
        [remindsKeyboardAll],
        [remindsKeyboardAdd],
        [remindsKeyboardDel],
        [remindsKeyboardBack]
    ]);

    remindsKeyboard = remindsKeyboard.resize().extra();

    return {
        remindsKeyboard,
        remindsKeyboardAll,
        remindsKeyboardAdd,
        remindsKeyboardDel,
        remindsKeyboardBack
    };
};

const getMainKeyboard = (ctx) => {
    const mainKeyboardTalon = ctx.i18n.t('keyboards.main.talon');
    const mainKeyboardPosition = ctx.i18n.t('keyboards.main.updateInfo');
    const mainKeyboardReminds = ctx.i18n.t('keyboards.main.reminds');
    const mainKeyboardSettings = ctx.i18n.t('keyboards.main.settings');
    let mainKeyboard = Markup.keyboard([
        [mainKeyboardTalon],
        [mainKeyboardPosition],
        [mainKeyboardReminds],
        [mainKeyboardSettings]
    ]);
    mainKeyboard = mainKeyboard.resize().extra();

    return {
        mainKeyboard,
        mainKeyboardTalon,
        mainKeyboardPosition,
        mainKeyboardReminds,
        mainKeyboardSettings
    };
};

const getTalonKeyboard = (ctx) => {
    const talonKeyboardStart = ctx.i18n.t('keyboards.talon.begin');
    const talonKeyboardFinish = ctx.i18n.t('keyboards.talon.end');
    const talonKeyboardBack = ctx.i18n.t('keyboards.backButton');

    let talonKeyboard = Markup.keyboard([
        [talonKeyboardStart],
        [talonKeyboardFinish],
        [talonKeyboardBack]
    ]);
    talonKeyboard = talonKeyboard.resize().extra();

    return {
        talonKeyboard,
        talonKeyboardStart,
        talonKeyboardFinish,
        talonKeyboardBack
    };
};

const getSettingsKeyboard = (ctx) => {
    const settingsKeyboardLanguage = ctx.i18n.t('keyboards.settings.language');
    const settingsKeyboardBack = ctx.i18n.t('keyboards.backButton');

    let settingsKeyboard = Markup.keyboard([
        settingsKeyboardLanguage,
        settingsKeyboardBack
    ]);
    settingsKeyboard = settingsKeyboard.resize().extra();

    return {
        settingsKeyboard,
        settingsKeyboardLanguage,
        settingsKeyboardBack
    };
};

const getLanguageSelectKeyboard = (ctx) => {
    const ru = 'Русский';
    const eng = 'English';
    const ukr = 'Українська';

    let languageKeyboard = Markup.inlineKeyboard([
        Markup.callbackButton(ru, 'ruL'),
        Markup.callbackButton(ukr, 'ukrL'),
        Markup.callbackButton(eng, 'engL')
    ]);
    languageKeyboard = languageKeyboard.extra();

    return {
        languageKeyboard,
    };
};

module.exports = {getMainKeyboard, getRemindsKeyboard, getTalonKeyboard, getSettingsKeyboard, getLanguageSelectKeyboard};

