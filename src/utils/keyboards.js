const {Markup} = require('telegraf');

const getRemindsKeyboard = (ctx) => {
    const remindsKeyboardAll = 'Просмотреть активные';
    const remindsKeyboardAdd = 'Добавить';
    const remindsKeyboardDel = 'Удалить';
    const remindsKeyboardBack = 'Назад';
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
    const mainKeyboardTalon = 'Талон';
    const mainKeyboardPosition = 'Обновить информацию';
    const mainKeyboardReminds = 'Напоминания';
    const mainKeyboardAnother = 'Another';
    let mainKeyboard = Markup.keyboard([
        [mainKeyboardTalon],
        [mainKeyboardPosition],
        [mainKeyboardReminds]
    ]);
    mainKeyboard = mainKeyboard.resize().extra();

    return {
        mainKeyboard,
        mainKeyboardTalon,
        mainKeyboardPosition,
        mainKeyboardReminds,
    };
};

const getTalonKeyboard = (ctx) => {
    const talonKeyboardStart = 'Начать';
    const talonKeyboardFinish = 'Завершить';
    const talonKeyboardBack = 'Назад';

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

module.exports = {getMainKeyboard, getRemindsKeyboard, getTalonKeyboard};

