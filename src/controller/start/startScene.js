'use strict';
const Scene = require('telegraf/scenes/base');
const Stage = require('telegraf/stage');
const {enter, leave} = Stage;
const {Markup} = require('telegraf');
const keyboards = require('../../utils/keyboards');


const startScene = new Scene('startScene');

startScene.enter(async (ctx)=>{
    ctx.reply('Введите номер талона:', Markup.removeKeyboard().extra());
});

startScene.on('message', async (ctx)=>{
    if(ctx.message.text === '123'){
        ctx.reply('Такого талона нет, попробуйте еще раз!');
    }
    else{
        ctx.reply('Готово!');
        const {mainKeyboard} = keyboards.getMainKeyboard(ctx);
        await ctx.reply('Что узнать:', mainKeyboard);
        ctx.scene.leave();
    }
});


module.exports = startScene;