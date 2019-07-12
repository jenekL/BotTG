const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const {enter, leave} = Stage;
const {Markup} = require('telegraf');
const keyboards = require('../../utils/keyboards');
const asyncWrapper = require('./../../utils/asyncWrapper');
const getRemindsList = require('./../../utils/reminds');
const {match} = require('telegraf-i18n');
const {contains} = require('./../../utils/arrayContains');

const reminderScene = new Scene('reminderScene');

const reminderList = [];
let reminderListAll = [];
let availableRemindList = [];

function setRemindersList() {
    Array.prototype.push.apply(reminderListAll, getRemindsList());

    reminderList.push({text: '10 минут', description: 'Оповещение за 10 минут до вызова'});
}

function setAvailableRemindList(ctx) {
    availableRemindList = [];
    for (item of reminderListAll) {
        if (!contains(reminderList, 'text', item.text)) {
            availableRemindList.push(item);
        }
    }
    availableRemindList.push(ctx.i18n.t('keyboards.backButton'));
}

reminderScene.enter(async (ctx) => {
    if (reminderListAll.length === 0) {
        setRemindersList();
    }

    setAvailableRemindList(ctx);
    await ctx.reply(ctx.i18n.t('scenes.reminds.yourReminder') + ' ' + reminderList[0].text + '\n' +
        ctx.i18n.t('scenes.reminds.selectAnother'), Markup.keyboard(availableRemindList).extra());
});

reminderScene.hears(match('keyboards.backButton'), async (ctx) => {
    ctx.scene.leave();
    const {mainKeyboard} = keyboards.getMainKeyboard(ctx);
    await ctx.reply(ctx.i18n.t('scenes.main.question'), mainKeyboard);
});

reminderScene.on('text', async (ctx) => {
    if (contains(availableRemindList, 'text', ctx.message.text)) {

        let index = -1;
        const val = availableRemindList.find((item, i) => {
            if (item.text === ctx.message.text) {
                index = i;
                return item;
            }
        });

        //availableRemindList.push(reminderList.pop());
        reminderList.pop();
        reminderList.push(val);

        setAvailableRemindList(ctx);
        await ctx.reply(ctx.i18n.t('scenes.reminds.selected') + ' ' + reminderList[0].text,
            Markup.keyboard(availableRemindList).extra());
    }
});

reminderScene.leave(async (ctx) => {
});


module.exports = {reminderScene};