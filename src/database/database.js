const mysql = require('mysql');
const util = require('util');

const dbcon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'tgbot'
});

dbcon.connect((err) => {
    if (err) throw err;
    console.log('database connected');
});

const query = util.promisify(dbcon.query).bind(dbcon);

async function getActive(user){
    const q = await query('SELECT * FROM clients WHERE id = ? AND source = "telegram" AND active = 1', user)
        .catch((error)=>console.log(error));
    return q.length !== 0;
}

function addUser(user) {
    dbcon.query('INSERT INTO clients SET ?', user, (error, result, fields) => {
        if (error) console.error(error);
        console.log('id:' + user.id + ', coupon:' + user.coupon + ' added');
    });
}

function delUserByID(userID) {
    dbcon.query('DELETE FROM clients WHERE id  = ? AND source = "telegram"', userID, (error, result, fields) => {
        // console.log(userID);
        if (error) console.error(error);
        // console.log(result);
    });
}

//deprecate
function getIDByTalon(talon) {
    dbcon.query('SELECT id FROM clients WHERE coupon = ? AND source = "telegram"', talon, (error, result, fields) => {
        if (error) console.error(error);
        //console.log(result);
        return result;
    });
}

//deprecate
function getTalonByID(userID) {
    dbcon.query('SELECT coupon FROM clients WHERE id = ? AND source = "telegram"', userID, (error, result, fields) => {
        if (error) console.error(error);
        //console.log(result[0]);
        return result[0];
    });
}

module.exports = {dbcon, addUser, delUserByID, getIDByTalon, getTalonByID, getActive};