const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const {enter, leave} = Stage;
const {Markup} = require('telegraf');
const keyboards = require('../../utils/keyboards');
const contains = require('./../../utils/arrayContains');
const {match} = require('telegraf-i18n');


let availableRemindList = [];
let remindsList = require('./reminds').remindsList;
let remindListAll = require('./reminds').remindListAll;

function setAvailableRemindList(ctx) {
    availableRemindList = [];
    for(item of remindListAll){
        if(!contains(remindsList, 'text', item.text)){
            availableRemindList.push(item);
        }
    }
    availableRemindList.push(ctx.i18n.t('keyboards.backButton'));
}

const addRemindScene = new Scene('addRemindScene');

addRemindScene.enter(async (ctx) => {
    setAvailableRemindList(ctx);
    ctx.reply(ctx.from.first_name + ctx.i18n.t('scenes.reminds.chooseOption'), Markup.keyboard(availableRemindList).extra());
});

addRemindScene.hears(match('keyboards.backButton'), async (ctx) => {
    leave();
    await ctx.scene.enter('reminderScene');
});

addRemindScene.on('text', async (ctx) => {
    if (contains(availableRemindList, 'text', ctx.message.text)) {
        //add remind

        let index = -1;
        const val = availableRemindList.find((item, i) => {
            if (item.text === ctx.message.text) {
                index = i;
                return item;
            }
        });

        remindsList.push(val);

        availableRemindList.splice(index, 1);

        await ctx.scene.enter('reminderScene');
    }
    // leave();
});

addRemindScene.leave(async (ctx) => {
});


module.exports = {addRemindScene};