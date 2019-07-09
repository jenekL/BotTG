const mysql = require('mysql');

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

//deprecate
function selectAll() {
    dbcon.query('SELECT * FROM users WHERE sourceName = "telegram"',
        (error, result, fields) => {
            //console.log(result);
        });
}

function addUser(user) {
    dbcon.query('INSERT INTO users SET ?', user, (error, result, fields) => {
        if (error) console.error(error);
       // console.log(result);
    });
}

function delUserByID(userID) {
    dbcon.query('DELETE FROM users WHERE id  = ? AND sourceName = "telegram"', userID, (error, result, fields) => {
       // console.log(userID);
        if (error) console.error(error);
       // console.log(result);
    });
}

function getIDByTalon(talon) {
    dbcon.query('SELECT id FROM users WHERE talonID = ? AND sourceName = "telegram"', talon, (error, result, fields) => {
        if (error) console.error(error);
        //console.log(result);
        return result;
    });
}

function getTalonByID(userID){
    dbcon.query('SELECT talonID FROM users WHERE id = ? AND sourceName = "telegram"', userID, (error, result, fields) => {
        if (error) console.error(error);
        //console.log(result[0]);
        return result[0];
    });
}

module.exports = {dbcon, selectAll, addUser, delUserByID, getIDByTalon, getTalonByID};