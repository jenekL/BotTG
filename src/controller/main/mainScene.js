'use strict';
const Scene = require('telegraf/scenes/base');
const Stage = require('telegraf/stage');
const {leave} = Stage;
const {Markup} = require('telegraf');
const keyboards = require('../../utils/keyboards');


const mainScene = new Scene('mainScene');

mainScene.enter(async (ctx) => {
    const {mainKeyboard} = keyboards.getMainKeyboard(ctx);
    await ctx.reply('Что узнать:', mainKeyboard);
});

mainScene.leave(async (ctx) => {
    const {mainKeyboard} = keyboards.getMainKeyboard(ctx);
    await ctx.reply('Что узнать:', mainKeyboard);
});

module.exports = {mainScene};