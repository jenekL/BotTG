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
    remindListAll.push({text: 'При приглашении к оператору', description: 'Вызов при приглашении к оператору'});
    remindListAll.push({text: '60 минут', description: 'Оповещение за 60 минут до вызова'});
    remindListAll.push({text: '30 минут', description: 'Оповещение за 30 минут до вызова'});
    remindListAll.push({text: '15 минут', description: 'Оповещение за 15 минут до вызова'});
    remindListAll.push({text: '10 минут', description: 'Оповещение за 10 минут до вызова'});

    remindsList.push({text: '10 минут', description: 'Оповещение за 10 минут до вызова'});
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
});

reminderScene.hears(/Просмотреть/, async (ctx) => {

    let list = await getList(remindsList);

    if (list === '') {
        await ctx.reply('Напоминания отсутствуют.');
    } else {
        await ctx.reply('Ваши напоминания:\n' + list, Markup.inlineKeyboard([
                Markup.callbackButton('Подробнее', 'details')
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

reminderScene.hears('Назад', async (ctx) => {
    leave();
    const {mainKeyboard} = keyboards.getMainKeyboard(ctx);
    await ctx.reply('Что узнать:', mainKeyboard);
});


reminderScene.action('details', async (ctx) => {

    let list = getDescriptionList(remindsList);

    await ctx.telegram.editMessageText(ctx.chat.id, ctx.callbackQuery.message.message_id,
        undefined, 'Ваши напоминания:\n' + list, Markup.inlineKeyboard([
            Markup.callbackButton('Кратко', 'short')
        ]).resize().extra()
    );

});

reminderScene.action('short', async (ctx) => {

    let list = getList(remindsList);

    await ctx.telegram.editMessageText(ctx.chat.id, ctx.callbackQuery.message.message_id,
        undefined, 'Ваши напоминания:\n' + list, Markup.inlineKeyboard([
            Markup.callbackButton('Подробнее', 'details')
        ]).resize().extra()
    );

});


module.exports = {reminderScene, remindsList, remindListAll};