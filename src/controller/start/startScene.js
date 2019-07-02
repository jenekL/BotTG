'use strict';
const Scene = require('telegraf/scenes/base');
const Stage = require('telegraf/stage');
const {enter, leave} = Stage;
const {Markup} = require('telegraf');
const keyboards = require('../../utils/keyboards');
const database = require('../../database/database');


const startScene = new Scene('startScene');

startScene.enter(async (ctx)=>{
    ctx.reply('Введите номер талона:', Markup.removeKeyboard().extra());
});

startScene.on('message', async (ctx)=>{
    ctx.reply(ctx.message.text);
    //TODO проверка
    if(ctx.message.text === '123'){
        //ctx.reply('Готово!');
        database.addUser({
            id: ctx.from.id,
            sourceName: 'telegram',
            talonID: Number(ctx.message.text)
        });
        const {mainKeyboard} = await keyboards.getMainKeyboard(ctx);
        await ctx.reply('Что узнать:', mainKeyboard);
        await ctx.scene.leave();
    }
    else{
        ctx.reply('Такого талона нет, попробуйте еще раз!');
    }
});


module.exports = startScene;