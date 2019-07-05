const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const {enter, leave} = Stage;
const {Markup} = require('telegraf');
const keyboards = require('../../utils/keyboards');
const asyncWrapper = require('./../../utils/asyncWrapper');
const getRemindsList = require('./../../utils/reminds');
const {match} = require('telegraf-i18n');

const reminderScene = new Scene('reminderScene');

const remindsList = [];
let remindListAll = [];

function setRemindsList() {
    Array.prototype.push.apply(remindListAll, getRemindsList());

    remindsList.push({text: '10 минут', description: 'Оповещение за 10 минут до вызова'});
}

reminderScene.enter(async (ctx) => {
    if (remindListAll.length === 0) {
        setRemindsList();
    }
    const {remindsKeyboard} = keyboards.getRemindsKeyboard(ctx);
    await ctx.reply(ctx.i18n.t('scenes.reminds.question'), remindsKeyboard);
});

reminderScene.hears(match('keyboards.reminds.add'), asyncWrapper(async (ctx) => {
    ctx.scene.enter('addRemindScene');
}));

reminderScene.hears(match('keyboards.reminds.del'), asyncWrapper(async (ctx) => {
    ctx.scene.enter('delRemindScene');
}));

reminderScene.hears(match('keyboards.reminds.all'), async (ctx) => {

    let list = getList(remindsList);

    if (list === '') {
        await ctx.reply(ctx.i18n.t('scenes.reminds.noReminds'));
    } else {
        await ctx.reply(ctx.i18n.t('scenes.reminds.yourReminds') + '\n' + list, Markup.inlineKeyboard([
                Markup.callbackButton(ctx.i18n.t('scenes.reminds.details'), 'details')
            ]).resize().extra()
        );
    }
});

function getList(remindsList) {
    let list = '';
    for (let i = 0; i < remindsList.length; i++) {
        list += (remindsList[i]['text'] + '\n');
    }
    return list;
}

function getDescriptionList(remindsList) {
    let list = '';
    for (let i = 0; i < remindsList.length; i++) {
        list += (remindsList[i].text + ':\n' + remindsList[i].description + '\n');
    }
    return list;
}

reminderScene.leave(async (ctx) => {
});

reminderScene.hears(match('keyboards.backButton'), async (ctx) => {
    leave();
    const {mainKeyboard} = keyboards.getMainKeyboard(ctx);
    await ctx.reply(ctx.i18n.t('scenes.main.question'), mainKeyboard);
});

reminderScene.action('details', async (ctx) => {
    let list = getDescriptionList(remindsList);

    await ctx.telegram.editMessageText(ctx.chat.id, ctx.callbackQuery.message.message_id,
        undefined, ctx.i18n.t('scenes.reminds.yourReminds') + '\n' + list, Markup.inlineKeyboard([
            Markup.callbackButton(ctx.i18n.t('scenes.reminds.short'), 'short')
        ]).resize().extra()
    );
});

reminderScene.action('short', async (ctx) => {
    let list = getList(remindsList);

    await ctx.telegram.editMessageText(ctx.chat.id, ctx.callbackQuery.message.message_id,
        undefined, ctx.i18n.t('scenes.reminds.yourReminds') + '\n' + list, Markup.inlineKeyboard([
            Markup.callbackButton(ctx.i18n.t('scenes.reminds.details'), 'details')
        ]).resize().extra()
    );
});

module.exports = {reminderScene, remindsList, remindListAll};