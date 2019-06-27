const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const {enter, leave} = Stage;
const {Markup} = require('telegraf');
const keyboards = require('../../utils/keyboards');


const reminderScene = new Scene('reminderScene');

const remindsList = [];
const remindListAll = [];

//TODO from db
function setRemindsList() {
    //from db


    remindListAll.push('При приглашении к оператору');
    remindListAll.push('60 минут');
    remindListAll.push('30 минут');
    remindListAll.push('15 минут');
    remindListAll.push('10 минут');

    remindsList.push('10');
    // remindsList.push('30');
}

reminderScene.enter(async (ctx) => {
    if (remindListAll.length === 0) {
        setRemindsList();
    }
    const {remindsKeyboard} = keyboards.getRemindsKeyboard(ctx);
    await ctx.reply('Выберите действие.', remindsKeyboard);
});

//TODO инфа откуда-то, список инфы только нужной
reminderScene.hears('Добавить', async (ctx) => {
    ctx.scene.enter('addRemindScene');
    console.log('add');
});

reminderScene.hears('Удалить', async (ctx) => {
    ctx.scene.enter('delRemindScene');
    console.log('del');
});

reminderScene.hears(/Просмотреть/, async (ctx) => {
    console.log('watch');
    let list = '';
    for (let i = 0; i < remindsList.length; i++) {
        list += (remindsList[i] + '\n');
    }
    await ctx.reply('Ваши напоминания:\n' + list, Markup.inlineKeyboard([
        Markup.callbackButton('Подробности', 'details')
        ]).resize().extra()
    );
});

reminderScene.leave(async (ctx) => {
    console.log('scene remind leave');
});

reminderScene.hears('Назад', async (ctx) => {
    leave();
    const {mainKeyboard} = keyboards.getMainKeyboard(ctx);
    await ctx.reply('Что узнать:', mainKeyboard);
});

//TODO details
reminderScene.action('details', async (ctx) =>{
    console.log(ctx.callbackQuery.inline_message_id);
    await ctx.telegram.editMessageText(ctx.chat.id,ctx.callbackQuery.message_id,
        ctx.callbackQuery.message_id, 'edited');
});


module.exports = {reminderScene, remindsList, remindListAll};