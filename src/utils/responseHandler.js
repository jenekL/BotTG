const database = require('./../database/database');
const keyboards = require('./keyboards');
const {getFromArray, getIndexOf} = require('./arrayContains');
const languageScene = require('./../controller/start/languageScene');

/*
time:
coupon:
id:
 */
let data = [];

function addData(elem) {
    data.push(elem);
}

function resultResponse(response, time) {
    const dataElem = getFromArray(data, 'time', Number(time));

    if (dataElem !== undefined) {
        switch (response) {
            case '0':
                console.log('0');

                database.addUser({
                    id: dataElem.id,
                    source: 'telegram',
                    coupon: dataElem.coupon
                });

                data.splice(getIndexOf(data, 'time', Number(time)), 1);

                if(dataElem.payload){
                    languageScene.setNotValid(false);
                    dataElem.context.scene.enter('languageScene');
                }
                else{
                    dataElem.context.scene.enter('mainScene');
                }

                break;
            case '1':
                console.log('1');

                dataElem.context.reply(ctx.i18n.t('scenes.start.talonNotExist'));

                data.splice(getIndexOf(data, 'time', Number(time)), 1);

                if(dataElem.payload){
                    languageScene.setNotValid(true);
                    dataElem.context.scene.enter('languageScene');
                }
                else{
                    dataElem.context.scene.enter('startScene');
                }

                break;
            case '404':
                console.log('404');

                dataElem.context.reply('404');
                dataElem.context.scene.enter('startScene');

                break;
            default:
                console.log('unknown code');
                break;
        }
    }

}


module.exports = {resultResponse, addData};