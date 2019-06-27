const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const {enter, leave} = Stage;
const {Markup} = require('telegraf');
const keyboards = require('../../utils/keyboards');


let availableRemindList = [];
let remindsList = require('./reminds').remindsList;
let remindListAll = require('./reminds').remindListAll;

function setAvailableRemindList() {
    availableRemindList = [];
    availableRemindList = remindListAll.filter(function (value) {
        return !remindsList.contains(value);
    });
    availableRemindList.push('Назад');
}

const addRemindScene = new Scene('addRemindScene');

addRemindScene.enter(async (ctx) => {
    setAvailableRemindList();
    ctx.reply(ctx.from.first_name + ', выберите услугу', Markup.keyboard(availableRemindList).extra());
});

addRemindScene.hears('Назад', async (ctx) => {
    console.log('add back');
    leave();
    await ctx.scene.enter('reminderScene');
});

//addRemindScene.hears('Назад',leave());


addRemindScene.on('text', async (ctx) => {
    if (availableRemindList.contains(ctx.message.text)) {
        //add remind
        remindsList.push(ctx.message.text);
        availableRemindList.splice(availableRemindList.indexOf(ctx.message.text), 1);
    }
   // leave();
    await ctx.scene.enter('reminderScene');
});

addRemindScene.leave(async (ctx) => {
    console.log('add scene leave');
    // const {remindsKeyboard} = keyboards.getRemindsKeyboard(ctx);
    // await ctx.reply('Выберите действие.', remindsKeyboard);
});


module.exports = {addRemindScene};