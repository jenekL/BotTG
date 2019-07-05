const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const {enter, leave} = Stage;
const {Markup} = require('telegraf');
const keyboards = require('../../utils/keyboards');
const contains = require('./../../utils/arrayContains');
const {match} = require('telegraf-i18n');

let delRemindList = [];
let remindsList = require('./reminds').remindsList;

const delRemindScene = new Scene('delRemindScene');

function setDelRemindList(ctx) {
    delRemindList = remindsList;
    delRemindList.push(ctx.i18n.t('keyboards.backButton'));
}

delRemindScene.enter((ctx) => {
    setDelRemindList(ctx);
    ctx.reply(ctx.from.first_name + ctx.i18n.t('scenes.reminds.chooseOption'), Markup.keyboard(delRemindList).extra());
});

delRemindScene.hears(match('keyboards.backButton'), async (ctx) => {
    leave();
    await ctx.scene.enter('reminderScene');
});


delRemindScene.on('text', async (ctx) => {
    if (contains(delRemindList, 'text', ctx.message.text)) {

        let index = -1;
        const val = remindsList.find((item, i) => {
            if (item.text === ctx.message.text) {
                index = i;
                return i;
            }
        });

        remindsList.splice(index, 1);

        await ctx.scene.enter('reminderScene');
    }
    //leave();
});

delRemindScene.leave(async (ctx) => {
    delRemindList.pop();
    // const {remindsKeyboard} = keyboards.getRemindsKeyboard(ctx);
    // await ctx.reply('Выберите действие.', remindsKeyboard);
});


module.exports = {delRemindList, delRemindScene};