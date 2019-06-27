const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const {enter, leave} = Stage;
const {Markup} = require('telegraf');
const keyboards = require('../../utils/keyboards');

let delRemindList = [];
let remindsList = require('./reminds').remindsList;

const delRemindScene = new Scene('delRemindScene');

function setDelRemindList() {
    console.log('del back');
    delRemindList = remindsList;
    remindsList.push('Назад');
}

delRemindScene.enter((ctx) => {
    setDelRemindList();
    ctx.reply(ctx.from.first_name + ', выберите услугу', Markup.keyboard(delRemindList).extra());
});

delRemindScene.hears('Назад', async (ctx) => {
    leave();
    await ctx.scene.enter('reminderScene');
});

delRemindScene.on('text', async (ctx) => {
    if (delRemindList.contains(ctx.message.text)) {
        remindsList.splice(remindsList.indexOf(ctx.message.text), 1);
    }
    //leave();
    await ctx.scene.enter('reminderScene');
});

delRemindScene.leave(async (ctx) => {
    delRemindList.pop();
    // const {remindsKeyboard} = keyboards.getRemindsKeyboard(ctx);
    // await ctx.reply('Выберите действие.', remindsKeyboard);
});


module.exports = {delRemindList, delRemindScene};